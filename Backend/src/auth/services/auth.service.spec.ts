// auth.service.spec.ts

import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { SupabaseService } from "../../supabase/services/supabase.service";
import { supabaseServiceMock } from "../../supabaseMock/supabase.service";
import { createClient, MockSupabaseClient } from "../../supabaseMock/mockSupabaseClient"; // Adjust import as per your structure

describe("AuthService", () => {
    let service: AuthService;
    let supabaseService: SupabaseService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: SupabaseService,
                    useValue: supabaseServiceMock,
                },
                // Provide mock values for supabaseUrl and supabaseAnonKey as needed
                { provide: 'supabaseUrl', useValue: 'mocked_supabase_url' },
                { provide: 'supabaseAnonKey', useValue: 'mocked_supabase_anon_key' },
                // Mock createClient function
                {
                    provide: 'createClient',
                    useValue: jest.fn().mockImplementation(createClient),
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        supabaseService = module.get<SupabaseService>(SupabaseService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    // Add more test cases as needed to validate AuthService functionality
});
