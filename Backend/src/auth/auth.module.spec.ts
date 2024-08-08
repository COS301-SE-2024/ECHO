import { Test } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import { AuthService } from './services/auth.service';
import { AuthController } from './controller/auth.controller';
import { SupabaseModule } from '../supabase/supabase.module';

describe('AuthModule', () => {
    let authModule: AuthModule;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AuthModule],
        }).compile();

        authModule = moduleRef.get<AuthModule>(AuthModule);
    });

    it('should be defined', () => {
        expect(authModule).toBeDefined();
    });

    it('should import SupabaseModule', () => {
        const imports = Reflect.getMetadata('imports', AuthModule);
        expect(imports).toContain(SupabaseModule);
    });

    it('should provide AuthService', () => {
        const providers = Reflect.getMetadata('providers', AuthModule);
        expect(providers).toContain(AuthService);
    });

    it('should include AuthController', () => {
        const controllers = Reflect.getMetadata('controllers', AuthModule);
        expect(controllers).toContain(AuthController);
    });
});