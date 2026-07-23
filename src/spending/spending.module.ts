import { Module } from "@nestjs/common";
import { SpendingRepository } from "./spending.repository";
import { SpendingService } from "./spending.service";
import { SpendingController } from "./spending.controller";

@Module({
  imports: [],
  controllers: [SpendingController],
  providers: [SpendingRepository, SpendingService],
})
export class SpendingModule {}
