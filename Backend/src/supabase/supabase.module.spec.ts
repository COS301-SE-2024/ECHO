import { Test, TestingModule } from "@nestjs/testing";
import {supabase} from "./lib/supabaseClient";
import { SupabaseService } from "./services/supabase.service";
import { HttpModule, HttpService } from "@nestjs/axios";