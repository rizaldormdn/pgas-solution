import {
  Controller,
  Get,
  Query,
  Res,
  BadRequestException,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { Response } from "express";
import { SpendingService } from "./spending.service";
import { RolesGuard } from "src/auth/roles.guard.ts";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Roles } from "src/auth/roles.decorator";

@ApiTags("Spendings")
@Controller("spendings")
@UseGuards(JwtAuthGuard, RolesGuard)
export class SpendingController {
  constructor(private readonly spendingService: SpendingService) {}

  @Get("report")
  @Roles("Admin", "User")
  @ApiOperation({
    summary: "Get spending report",
    description: "Get spending report with optional filters",
  })
  @ApiResponse({
    status: 200,
    description: "Report retrieved successfully",
  })
  @ApiQuery({ name: "minSpending", required: false, example: 1000 })
  @ApiQuery({ name: "maxSpending", required: false, example: 100000 })
  @ApiQuery({ name: "startDate", required: false, example: "2026-01-01" })
  @ApiQuery({ name: "endDate", required: false, example: "2026-07-24" })
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

  @Get("report/export")
  @Roles("Admin", "User")
  @ApiOperation({
    summary: "Export spending report",
    description: "Export spending report to Excel (.xlsx) or PDF format",
  })
  @ApiResponse({
    status: 200,
    description: "File exported successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid format. Use 'xlsx' or 'pdf'",
  })
  @ApiQuery({
    name: "format",
    required: true,
    enum: ["xlsx", "pdf"],
    example: "xlsx",
    description: "Export format: xlsx or pdf",
  })
  @ApiQuery({ name: "minSpending", required: false, example: 1000 })
  @ApiQuery({ name: "maxSpending", required: false, example: 100000 })
  @ApiQuery({ name: "startDate", required: false, example: "2026-01-01" })
  @ApiQuery({ name: "endDate", required: false, example: "2026-07-24" })
  async exportReport(
    @Res() res: Response,
    @Query("format") format: string,
    @Query("minSpending") minSpending?: number,
    @Query("maxSpending") maxSpending?: number,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    const validFormats = ["xlsx", "pdf"];
    if (!format || !validFormats.includes(format.toLowerCase())) {
      throw new BadRequestException(
        `Invalid format. Please use one of: ${validFormats.join(", ")}`,
      );
    }

    return this.spendingService.exportReport(
      res,
      {
        minSpending,
        maxSpending,
        startDate,
        endDate,
      },
      format,
    );
  }
}
