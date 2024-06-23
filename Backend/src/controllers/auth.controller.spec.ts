import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { SupabaseService } from "../supabase/supabase.service";
import { AuthService } from "../services/auth.service";
import { supabaseServiceMock } from "../supabaseMock/supabase.service";

describe("AuthController", () => {
    let authController: AuthController;
    let authService: AuthService;
    let supabaseService: SupabaseService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                AuthService,
                {
                    provide: SupabaseService,
                    useValue: supabaseServiceMock
                },
            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
        supabaseService = module.get<SupabaseService>(SupabaseService);
    });

    it("should be defined", () => {
        expect(authController).toBeDefined();
    });
});
