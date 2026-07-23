import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Register new employee",
    description: "Create a new employee account with email and password",
  })
  @ApiResponse({
    status: 201,
    description: "Employee registered successfully",
    schema: {
      example: {
        status: "success",
        message: "Employee registered successfully",
        data: {
          employeeId: 1,
          employeeName: "John Doe",
          employeeEmail: "john@example.com",
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Email already exists or validation failed",
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
  async register(
    @Body()
    dto: {
      employeeName: string;
      employeeEmail: string;
      employeePassword: string;
      departmentId: number;
      roleId: number;
    },
  ) {
    return this.authService.register(dto);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Login employee",
    description: "Authenticate employee and return JWT token",
  })
  @ApiResponse({
    status: 200,
    description: "Login successful",
    schema: {
      example: {
        status: "success",
        message: "Login successful",
        data: {
          employee: {
            employee_id: 1,
            employee_name: "John Doe",
            employee_email: "john@example.com",
            department_id: 1,
            role_id: 1,
          },
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Invalid email or password",
    schema: {
      example: {
        statusCode: 400,
        message: "Invalid email or password",
        error: "Bad Request",
      },
    },
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        employeeEmail: { type: "string", example: "john@example.com" },
        employeePassword: { type: "string", example: "password123" },
      },
      required: ["employeeEmail", "employeePassword"],
    },
  })
  async login(
    @Body() dto: { employeeEmail: string; employeePassword: string },
  ) {
    return this.authService.login(dto);
  }
}
