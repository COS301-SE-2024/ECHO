import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { createSupabaseClient } from '../../supabase/services/supabaseClient';

jest.mock('../../supabase/services/supabaseClient');

describe('AuthService', () => {
    let service: AuthService;
    let mockSupabaseClient: any;

    beforeEach(async () => {
        mockSupabaseClient = {
            auth: {
                signInWithPassword: jest.fn(),
                signUp: jest.fn(),
                signOut: jest.fn(),
                getUser: jest.fn(),
                setSession: jest.fn(),
            },
        };

        (createSupabaseClient as jest.Mock).mockReturnValue(mockSupabaseClient);

        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('signIn', () => {
        it('should sign in a user successfully', async () => {
            const mockUser = { id: '1', email: 'test@example.com' };
            const mockSession = { access_token: 'token', refresh_token: 'refresh' };
            mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
                data: { user: mockUser, session: mockSession },
                error: null,
            });

            const result = await service.signIn({ email: 'test@example.com', password: 'password' });

            expect(result).toEqual({ user: mockUser, session: mockSession });
            expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password',
            });
        });

        it('should throw an error if sign in fails', async () => {
            mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
                data: null,
                error: { message: 'Invalid credentials' },
            });

            await expect(service.signIn({ email: 'test@example.com', password: 'wrong' }))
                .rejects.toThrow('Invalid credentials');
        });
    });

    describe('signUp', () => {
        it('should sign up a user successfully', async () => {
            const mockUser = { id: '1', email: 'new@example.com' };
            const mockSession = { access_token: 'token', refresh_token: 'refresh' };
            mockSupabaseClient.auth.signUp.mockResolvedValue({
                data: { user: mockUser, session: mockSession },
                error: null,
            });

            const result = await service.signUp('new@example.com', 'password', { name: 'New User' });

            expect(result).toEqual({ user: mockUser, session: mockSession });
            expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
                email: 'new@example.com',
                password: 'password',
                options: { data: { name: 'New User' } },
            });
        });

        it('should throw an error if sign up fails', async () => {
            mockSupabaseClient.auth.signUp.mockResolvedValue({
                data: null,
                error: { message: 'Email already in use' },
            });

            await expect(service.signUp('existing@example.com', 'password', {}))
                .rejects.toThrow('Email already in use');
        });
    });

    describe('signOut', () => {
        it('should sign out a user successfully', async () => {
            mockSupabaseClient.auth.signOut.mockResolvedValue({ error: null });

            const result = await service.signOut('access_token', 'refresh_token');

            expect(result).toEqual({ message: 'Signed out successfully' });
            expect(mockSupabaseClient.auth.setSession).toHaveBeenCalledWith({
                access_token: 'access_token',
                refresh_token: 'refresh_token',
            });
            expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled();
        });

        it('should throw an error if sign out fails', async () => {
            mockSupabaseClient.auth.signOut.mockResolvedValue({ error: { message: 'Sign out failed' } });

            await expect(service.signOut('access_token', 'refresh_token'))
                .rejects.toThrow('Sign out failed');
        });
    });

    describe('getCurrentUser', () => {
        it('should get the current user successfully', async () => {
            const mockUser = { id: '1', email: 'test@example.com' };
            mockSupabaseClient.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

            const result = await service.getCurrentUser('access_token', 'refresh_token');

            expect(result).toEqual({ user: mockUser });
            expect(mockSupabaseClient.auth.setSession).toHaveBeenCalledWith({
                access_token: 'access_token',
                refresh_token: 'refresh_token',
            });
        });

        it('should throw an error if no user is signed in', async () => {
            mockSupabaseClient.auth.getUser.mockResolvedValue({ data: { user: null } });

            await expect(service.getCurrentUser('access_token', 'refresh_token'))
                .rejects.toThrow('No user is signed in');
        });
    });

    describe('setSession', () => {
        it('should set the session correctly', async () => {
            const result = await service.setSession('access_token', 'refresh_token');

            expect(mockSupabaseClient.auth.setSession).toHaveBeenCalledWith({
                access_token: 'access_token',
                refresh_token: 'refresh_token',
            });
        });
    });

    describe('getProvider', () => {
        it('should return the provider for a logged-in user', async () => {
            const mockUser = {
                id: '1',
                email: 'test@example.com',
                app_metadata: { provider: 'google' },
            };
            mockSupabaseClient.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

            const result = await service.getProvider('access_token', 'refresh_token');

            expect(result).toBe('google');
            expect(mockSupabaseClient.auth.setSession).toHaveBeenCalledWith({
                access_token: 'access_token',
                refresh_token: 'refresh_token',
            });
        });

        it('should return "none" if no user is logged in', async () => {
            mockSupabaseClient.auth.getUser.mockResolvedValue({ data: { user: null } });

            const result = await service.getProvider('access_token', 'refresh_token');

            expect(result).toEqual({
                provider: 'none',
                message: 'No user logged in',
            });
        });
    });
});