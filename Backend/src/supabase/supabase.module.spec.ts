import { Test, TestingModule } from '@nestjs/testing';
import { SupabaseModule } from './supabase.module';
import { SupabaseService } from './services/supabase.service';

// We'll still mock the Supabase client to prevent actual network requests
jest.mock('@supabase/supabase-js', () => ({
    createClient: jest.fn(),
}));

describe('SupabaseModule', () => {
    let module: TestingModule;
    let supabaseService: SupabaseService;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [SupabaseModule],
        }).compile();

        supabaseService = module.get<SupabaseService>(SupabaseService);
    });

    it('should be defined', () => {
        expect(module).toBeDefined();
    });

    describe('SupabaseService', () => {
        it('should be defined', () => {
            expect(supabaseService).toBeDefined();
        });

        // We'll remove the 'getData' test since it doesn't exist

    });
});