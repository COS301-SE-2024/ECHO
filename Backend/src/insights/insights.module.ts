import { Module } from '@nestjs/common';
import { InsightsService } from './services/insights.service';
import { InsightsController } from './controller/insights.controller';
import { HttpModule } from "@nestjs/axios";
import { SupabaseModule } from "../supabase/supabase.module";
import { SupabaseService } from "../supabase/services/supabase.service";

@Module({
  imports: [HttpModule, SupabaseModule],
  controllers: [InsightsController],
  providers: [InsightsService, SupabaseService],
})
export class InsightsModule {}
