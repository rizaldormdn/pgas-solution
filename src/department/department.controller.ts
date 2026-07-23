import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { DepartmentService } from "./department.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/roles.guard.ts";
import { Roles } from "src/auth/roles.decorator";

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post("/department")
  @Roles("Admin", "User")
  async create(@Body() department: { departmentName: string }) {
    return this.departmentService.create(department);
  }

  @Get("/departments")
  @Roles("Admin", "User")
  async getDepartments(
    @Query("page", new ParseIntPipe({ optional: true })) page?: number,
    @Query("limit", new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.departmentService.read({ page, limit });
  }

  @Get("/department/:id")
  @Roles("Admin", "User")
  async getDepartment(@Param("id") departmentId: number) {
    return this.departmentService.findOne(departmentId);
  }

  @Put("/department/:id")
  @Roles("Admin")
  async update(
    @Param("id") departmentId: number,
    @Body() department: { departmentName: string },
  ) {
    return this.departmentService.update(departmentId, department);
  }

  @Delete("/department/:id")
  @Roles("Admin")
  async delete(@Param("id") departmentId: number) {
    return this.departmentService.delete(departmentId);
  }
}
