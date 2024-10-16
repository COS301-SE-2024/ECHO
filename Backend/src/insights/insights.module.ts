import { Module } from '@nestjs/common';
import { InsightsService } from './services/insights.service';
import { InsightsController } from './controller/insights.controller';

@Module({
  controllers: [InsightsController],
  providers: [InsightsService],
})
export class InsightsModule {}
