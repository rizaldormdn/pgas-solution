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
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from "@nestjs/swagger";
import { DepartmentService } from "./department.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/roles.guard.ts";
import { Roles } from "src/auth/roles.decorator";
import { ResponseMessage } from "src/common/decorators/response.decorator";

@ApiTags("Departments")
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post("/department")
  @Roles("Admin", "User")
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage("Department created successfully")
  @ApiOperation({
    summary: "Create a new department",
    description:
      "Create a new department with the given name. Only Admin and User roles can access.",
  })
  @ApiCreatedResponse({
    description: "Department created successfully",
    schema: {
      example: {
        status: "success",
        message: "Department created successfully",
        data: {
          department_id: 1,
          department_name: "IT Department",
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Bad Request - Invalid input",
    schema: {
      example: {
        statusCode: 400,
        message: "Department name is required",
        error: "Bad Request",
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized - No JWT token provided",
    schema: {
      example: {
        statusCode: 401,
        message: "Unauthorized",
      },
    },
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        departmentName: { type: "string", example: "IT Department" },
      },
      required: ["departmentName"],
    },
  })
  async create(@Body() department: { departmentName: string }) {
    return this.departmentService.create(department);
  }

  @Get("/departments")
  @Roles("Admin", "User")
  @ResponseMessage("Departments retrieved successfully")
  @ApiOperation({
    summary: "Get all departments",
    description:
      "Get all departments with pagination. Only Admin and User roles can access.",
  })
  @ApiOkResponse({
    description: "Departments retrieved successfully",
    schema: {
      example: {
        status: "success",
        message: "Departments retrieved successfully",
        data: [
          {
            department_id: 1,
            department_name: "IT Department",
          },
          {
            department_id: 2,
            department_name: "HR Department",
          },
        ],
        meta: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized - No JWT token provided",
    schema: {
      example: {
        statusCode: 401,
        message: "Unauthorized",
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
  async getDepartments(
    @Query("page", new ParseIntPipe({ optional: true })) page?: number,
    @Query("limit", new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.departmentService.read({ page, limit });
  }

  @Get("/department/:id")
  @Roles("Admin", "User")
  @ResponseMessage("Department retrieved successfully")
  @ApiOperation({
    summary: "Get department by ID",
    description:
      "Get a specific department by its ID. Only Admin and User roles can access.",
  })
  @ApiOkResponse({
    description: "Department found",
    schema: {
      example: {
        status: "success",
        message: "Department retrieved successfully",
        data: {
          department_id: 1,
          department_name: "IT Department",
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: "Department not found",
    schema: {
      example: {
        statusCode: 404,
        message: "Department with ID 1 not found",
        error: "Not Found",
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized - No JWT token provided",
    schema: {
      example: {
        statusCode: 401,
        message: "Unauthorized",
      },
    },
  })
  @ApiParam({ name: "id", description: "Department ID", example: 1 })
  async getDepartment(@Param("id") departmentId: number) {
    return this.departmentService.findOne(departmentId);
  }

  @Put("/department/:id")
  @Roles("Admin")
  @ResponseMessage("Department updated successfully")
  @ApiOperation({
    summary: "Update department",
    description: "Update a department by ID. Only Admin role can access.",
  })
  @ApiOkResponse({
    description: "Department updated successfully",
    schema: {
      example: {
        status: "success",
        message: "Department updated successfully",
        data: {
          department_id: 1,
          department_name: "IT Department Updated",
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: "Department not found",
    schema: {
      example: {
        statusCode: 404,
        message: "Department with ID 1 not found",
        error: "Not Found",
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Bad Request - Invalid input",
    schema: {
      example: {
        statusCode: 400,
        message: "Department name is required",
        error: "Bad Request",
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized - No JWT token provided",
    schema: {
      example: {
        statusCode: 401,
        message: "Unauthorized",
      },
    },
  })
  @ApiForbiddenResponse({
    description: "Forbidden - Admin role required",
    schema: {
      example: {
        statusCode: 403,
        message: "Forbidden resource",
        error: "Forbidden",
      },
    },
  })
  @ApiParam({ name: "id", description: "Department ID", example: 1 })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        departmentName: { type: "string", example: "IT Department Updated" },
      },
      required: ["departmentName"],
    },
  })
  async update(
    @Param("id") departmentId: number,
    @Body() department: { departmentName: string },
  ) {
    return this.departmentService.update(departmentId, department);
  }

  @Delete("/department/:id")
  @Roles("Admin")
  @ResponseMessage("Department deleted successfully")
  @ApiOperation({
    summary: "Delete department",
    description: "Delete a department by ID. Only Admin role can access.",
  })
  @ApiOkResponse({
    description: "Department deleted successfully",
    schema: {
      example: {
        status: "success",
        message: "Department deleted successfully",
        data: {
          affected: 1,
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: "Department not found",
    schema: {
      example: {
        statusCode: 404,
        message: "Department with ID 1 not found",
        error: "Not Found",
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized - No JWT token provided",
    schema: {
      example: {
        statusCode: 401,
        message: "Unauthorized",
      },
    },
  })
  @ApiForbiddenResponse({
    description: "Forbidden - Admin role required",
    schema: {
      example: {
        statusCode: 403,
        message: "Forbidden resource",
        error: "Forbidden",
      },
    },
  })
  @ApiParam({ name: "id", description: "Department ID", example: 1 })
  async delete(@Param("id") departmentId: number) {
    return this.departmentService.delete(departmentId);
  }
}
