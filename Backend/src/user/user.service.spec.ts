import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

describe('UserService', () => {
  let service: UserService;
  let model: Model<UserDocument>;

  const mockUserModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('default_value'),
            set: jest.fn().mockReturnValue('default_value'),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const user = {
        username: 'testUser',
        password: 'hashedPassword',
      } as UserDocument;
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      });

      expect(await service.findOne('testUser')).toEqual(user);
    });

    it('should return an error if user not found', async () => {
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      expect(await service.findOne('nonexistentUser')).toEqual({
        error: 'User not found',
        message: 'The user with the provided username does not exist',
      });
    });
  });

  describe('validateUser', () => {
    it('should return a user if validation is successful', async () => {
      const user = {
        username: 'testUser',
        password: await bcrypt.hash('plainPassword', 10),
        email: 'mock@email.com',
        spotifyConnected: true,
        toObject: jest.fn().mockReturnValue({
          username: 'testUser',
          // Add other fields as necessary
        }),
      } as Partial<UserDocument> as UserDocument;

      jest.spyOn(service, 'findOne').mockResolvedValue(user);

      const compareSpy = jest.spyOn(
        bcrypt,
        'compare',
      ) as unknown as jest.MockInstance<Promise<boolean>, [string, string]>;

      compareSpy.mockResolvedValue(true);

      expect(await service.validateUser('testUser', 'plainPassword')).toEqual({
        message: 'Login successful',
        user: { username: 'testUser' },
      });
    });

    it('should return an error if validation fails', async () => {
      const user = {
        username: 'testUser',
        password: 'hashedPassword',
      } as Partial<UserDocument> as UserDocument;
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      const compareSpy = jest.spyOn(
        bcrypt,
        'compare',
      ) as unknown as jest.MockInstance<Promise<boolean>, [string, string]>;

      compareSpy.mockResolvedValue(false);

      expect(await service.validateUser('testUser', 'wrongPassword')).toEqual({
        error: 'Login failed',
        message: 'Invalid username or password',
      });
    });
  });
});
