import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { EmployeeService } from "./employee.service";

@Controller()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post("/employee")
  async create(employee: {
    employeeName: string;
    employeeEmail: string;
    employeePassword: string;
    departmentId: number;
    roleId: number;
  }) {
    return this.employeeService.create(employee);
  }

  @Get("/employees")
  async getEmployees(
    @Query("page", new ParseIntPipe({ optional: true })) page?: number,
    @Query("limit", new ParseIntPipe({ optional: true })) limit?: number,
    @Query("name") name?: string,
    @Query("department") department?: string,
  ) {
    return this.employeeService.read({ page, limit, name, department });
  }

  @Get("/employee/:id")
  async getEmployee(@Query("id", new ParseIntPipe()) employeeId: number) {
    return this.employeeService.findOne(employeeId);
  }

  @Put("/employee/:id")
  async update(
    @Param("id") employeeId: number,
    employee: {
      employeeName: string;
      employeeEmail: string;
      departmentId: number;
      roleId: number;
    },
  ) {
    return this.employeeService.update(employeeId, employee);
  }

  @Delete("/employee/:id")
  async delete(@Param("id") employeeId: number) {
    return this.employeeService.delete(employeeId);
  }
}
