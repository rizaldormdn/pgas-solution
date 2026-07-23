import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
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
  async login(
    @Body() dto: { employeeEmail: string; employeePassword: string },
  ) {
    return this.authService.login(dto);
  }
}
