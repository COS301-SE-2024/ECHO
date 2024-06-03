import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';

@Module({
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
export class AppModule {
  public userLoggedIn: boolean = false;
}
