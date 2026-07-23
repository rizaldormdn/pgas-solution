import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { ResponseMessage } from "src/common/decorators/response.decorator";
import { EmployeeService } from "./employee.service";
import { RolesGuard } from "src/auth/roles.guard.ts";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Roles } from "src/auth/roles.decorator";

@ApiTags("Employees")
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post("/employee")
  @Roles("Admin", "User")
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage("Employee created successfully")
  @ApiOperation({
    summary: "Create a new employee",
    description: "Create a new employee with all required fields",
  })
  @ApiCreatedResponse({
    description: "Employee created successfully",
    schema: {
      example: {
        status: "success",
        message: "Employee created successfully",
        data: {
          employee_id: 1,
          employee_name: "John Doe",
          employee_email: "john@example.com",
          department_id: 1,
          role_id: 1,
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Bad Request - Validation failed or email already exists",
    schema: {
      example: {
        statusCode: 400,
        message: "Email already exists",
        error: "Bad Request",
      },
    },
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        employeeName: { type: "string", example: "John Doe" },
        employeeEmail: { type: "string", example: "john@example.com" },
        employeePassword: { type: "string", example: "password123" },
        departmentId: { type: "number", example: 1 },
        roleId: { type: "number", example: 1 },
      },
      required: [
        "employeeName",
        "employeeEmail",
        "employeePassword",
        "departmentId",
        "roleId",
      ],
    },
  })
  async create(
    @Body()
    employee: {
      employeeName: string;
      employeeEmail: string;
      employeePassword: string;
      departmentId: number;
      roleId: number;
    },
  ) {
    return this.employeeService.create(employee);
  }

  @Get("/employees")
  @Roles("Admin", "User")
  @ResponseMessage("Employees retrieved successfully")
  @ApiOperation({
    summary: "Get all employees",
    description: "Get all employees with pagination and optional filters",
  })
  @ApiOkResponse({
    description: "Employees retrieved successfully",
    schema: {
      example: {
        status: "success",
        message: "Employees retrieved successfully",
        data: [
          {
            employee_id: 1,
            employee_name: "John Doe",
            employee_email: "john@example.com",
            department_id: 1,
            role_id: 1,
          },
        ],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      },
    },
  })
  @ApiQuery({
    name: "page",
    required: false,
    example: 1,
    description: "Page number",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    example: 10,
    description: "Items per page",
  })
  @ApiQuery({
    name: "name",
    required: false,
    example: "John",
    description: "Filter by employee name",
  })
  @ApiQuery({
    name: "department",
    required: false,
    example: "IT",
    description: "Filter by department",
  })
  async getEmployees(
    @Query("page", new ParseIntPipe({ optional: true })) page?: number,
    @Query("limit", new ParseIntPipe({ optional: true })) limit?: number,
    @Query("name") name?: string,
    @Query("department") department?: string,
  ) {
    return this.employeeService.read({ page, limit, name, department });
  }

  @Get("/employee/:id")
  @Roles("Admin", "User")
  @ResponseMessage("Employee retrieved successfully")
  @ApiOperation({
    summary: "Get employee by ID",
    description: "Get a specific employee by their ID",
  })
  @ApiOkResponse({
    description: "Employee found",
    schema: {
      example: {
        status: "success",
        message: "Employee retrieved successfully",
        data: {
          employee_id: 1,
          employee_name: "John Doe",
          employee_email: "john@example.com",
          department_id: 1,
          role_id: 1,
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: "Employee not found",
    schema: {
      example: {
        statusCode: 404,
        message: "Employee with ID 1 not found",
        error: "Not Found",
      },
    },
  })
  @ApiParam({ name: "id", description: "Employee ID", example: 1 })
  async getEmployee(@Param("id") employeeId: number) {
    return this.employeeService.findOne(employeeId);
  }

  @Put("/employee/:id")
  @Roles("Admin")
  @ResponseMessage("Employee updated successfully")
  @ApiOperation({
    summary: "Update employee",
    description: "Update an employee by ID",
  })
  @ApiOkResponse({
    description: "Employee updated successfully",
    schema: {
      example: {
        status: "success",
        message: "Employee updated successfully",
        data: {
          employee_id: 1,
          employee_name: "John Doe Updated",
          employee_email: "john.updated@example.com",
          department_id: 1,
          role_id: 1,
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: "Employee not found",
    schema: {
      example: {
        statusCode: 404,
        message: "Employee with ID 1 not found",
        error: "Not Found",
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Bad Request - Invalid input",
    schema: {
      example: {
        statusCode: 400,
        message: "Invalid input data",
        error: "Bad Request",
      },
    },
  })
  @ApiParam({ name: "id", description: "Employee ID", example: 1 })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        employeeName: { type: "string", example: "John Doe Updated" },
        employeeEmail: { type: "string", example: "john.updated@example.com" },
        departmentId: { type: "number", example: 1 },
        roleId: { type: "number", example: 1 },
      },
      required: ["employeeName", "employeeEmail", "departmentId", "roleId"],
    },
  })
  async update(
    @Param("id") employeeId: number,
    @Body()
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
  @Roles("Admin")
  @ResponseMessage("Employee deleted successfully")
  @ApiOperation({
    summary: "Delete employee",
    description: "Delete an employee by ID",
  })
  @ApiOkResponse({
    description: "Employee deleted successfully",
    schema: {
      example: {
        status: "success",
        message: "Employee deleted successfully",
        data: {
          affected: 1,
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: "Employee not found",
    schema: {
      example: {
        statusCode: 404,
        message: "Employee with ID 1 not found",
        error: "Not Found",
      },
    },
  })
  @ApiParam({ name: "id", description: "Employee ID", example: 1 })
  async delete(@Param("id") employeeId: number) {
    return this.employeeService.delete(employeeId);
  }
}
