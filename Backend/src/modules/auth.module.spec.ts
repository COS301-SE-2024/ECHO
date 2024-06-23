process.env.SUPABASE_URL = 'MockURL';
process.env.SUPABASE_ANON_KEY = 'MockKey';

import { Test, TestingModule } from "@nestjs/testing";
import { AuthModule } from "./auth.module";
import { AuthService } from "../services/auth.service";
import { AuthController } from "../controllers/auth.controller";
import { SupabaseService } from "../supabase/supabase.service";

describe("AuthModule", () => {
    let authController: AuthController;
    let authService: AuthService;
    let supabaseService: SupabaseService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [AuthModule],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
        supabaseService = module.get<SupabaseService>(SupabaseService);
    });

    it("should compile the module", () => {
        expect(module).toBeDefined();
    });

    it("should provide AuthService", () => {
        expect(authService).toBeDefined();
    });

    it("should provide AuthController", () => {
        expect(authController).toBeDefined();
    });
});
