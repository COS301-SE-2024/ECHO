import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { UserModule } from './user/user.module';
import { Logger } from '@nestjs/common';

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn().mockReturnValue('mongodb://localhost/test'),
    };

    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => {
            Logger.log('Factory function called', 'Database');
            const uri = configService.get<string>('MONGODB_URI');
            Logger.log(`MongoDB URI: ${uri}`, 'Database');
            return { uri };
          },
          inject: [ConfigService],
        }),
        UserModule,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(mockConfigService)
      .compile();
  });

  it('should compile the module', () => {
    expect(module).toBeDefined();
  });

  it('should use the correct MongoDB URI', () => {
    const configService = module.get<ConfigService>(ConfigService);
    expect(configService.get('MONGODB_URI')).toBe('mongodb://localhost/test');
  });
});
