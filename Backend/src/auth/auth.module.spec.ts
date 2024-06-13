import { Test, TestingModule } from "@nestjs/testing";
import { AuthModule } from "./auth.module";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

describe("AuthModule", () => {
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [AuthModule],
        }).compile();
    });

    it("should compile the module", () => {
        expect(module).toBeDefined();
    });

    it("should provide AuthService", () => {
        const authService = module.get<AuthService>(AuthService);
        expect(authService).toBeDefined();
    });

    it("should provide AuthController", () => {
        const authController = module.get<AuthController>(AuthController);
        expect(authController).toBeDefined();
    });
});
