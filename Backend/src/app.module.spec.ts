import { Test, TestingModule } from "@nestjs/testing";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";
//import { UserModule } from "./user/user.module";
import { MongoMemoryServer } from "mongodb-memory-server";

describe("AppModule", () => {
    let module: TestingModule;
    let mongod: MongoMemoryServer;

    beforeAll(async () => {
        mongod = new MongoMemoryServer();
        await mongod.start();
    });

    afterAll(async () => {
        await mongod.stop();
    });

    beforeEach(async () => {
        const uri = await mongod.getUri();
        const mockConfigService = {
            get: jest.fn().mockImplementation((key: string) => {
                if (key === "MONGODB_URI") {
                    return uri;
                }
                return null;
            }),
        };

        module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                }),
            ],
        })
            .overrideProvider(ConfigService)
            .useValue(mockConfigService)
            .compile();
    });

    it("should compile the module", () => {
        expect(module).toBeDefined();
    });

    it("should use the correct MongoDB URI", () => {
        const configService = module.get<ConfigService>(ConfigService);
        expect(configService.get("MONGODB_URI")).toBeDefined();
    });
});
