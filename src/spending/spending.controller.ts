import { Controller, Get, Query, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/roles.guard.ts";
import { SpendingService } from "./spending.service";
import { Roles } from "src/auth/roles.decorator";

@Controller("spendings")
// @UseGuards(JwtAuthGuard, RolesGuard)
export class SpendingController {
  constructor(private readonly spendingService: SpendingService) {}

  @Get("report")
  //   @Roles("Admin", "User")
  async getReport(
    @Query("minSpending") minSpending?: number,
    @Query("maxSpending") maxSpending?: number,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    return this.spendingService.getReport({
      minSpending,
      maxSpending,
      startDate,
      endDate,
    });
  }

  @Get("report/xlsx")
  //   @Roles("Admin")
  async exportXlsx(
    @Res() res: Response,
    @Query("minSpending") minSpending?: number,
    @Query("maxSpending") maxSpending?: number,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    return this.spendingService.exportXlsx(res, {
      minSpending,
      maxSpending,
      startDate,
      endDate,
    });
  }

  @Get("report/pdf")
  //   @Roles("Admin")
  async exportPdf(
    @Res() res: Response,
    @Query("minSpending") minSpending?: number,
    @Query("maxSpending") maxSpending?: number,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    return this.spendingService.exportPdf(res, {
      minSpending,
      maxSpending,
      startDate,
      endDate,
    });
  }
}
