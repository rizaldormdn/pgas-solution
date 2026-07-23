import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { EmployeeRepository } from "src/employee/employee.repository";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: {
    employeeName: string;
    employeeEmail: string;
    employeePassword: string;
    departmentId: number;
    roleId: number;
  }) {
    try {
      const existingEmployee = await this.employeeRepository.findByEmail(
        dto.employeeEmail,
      );

      if (existingEmployee) {
        throw new BadRequestException("Email already exists");
      }

      const hashedPassword = await bcrypt.hash(dto.employeePassword, 10);

      await this.employeeRepository.create({
        employeeName: dto.employeeName,
        employeeEmail: dto.employeeEmail,
        employeePassword: hashedPassword,
        departmentId: dto.departmentId,
        roleId: dto.roleId,
      });
      return {
        status: "success",
        message: "Employee registered successfully",
      };
    } catch (error) {
      Logger.error("Error during registration", error.stack);
      throw error;
    }
  }

  async login(dto: { employeeEmail: string; employeePassword: string }) {
    try {
      if (!dto.employeeEmail || !dto.employeePassword) {
        throw new BadRequestException("Email and password are required");
      }

      const employee = await this.employeeRepository.findByEmail(
        dto.employeeEmail,
      );

      if (!employee) {
        throw new BadRequestException("Invalid email or password");
      }

      const hashedPassword = employee.employee_password;

      if (!hashedPassword) {
        throw new BadRequestException("Invalid credentials");
      }

      // Compare password
      const isPasswordMatch = await bcrypt.compare(
        dto.employeePassword,
        hashedPassword,
      );

      if (!isPasswordMatch) {
        throw new BadRequestException("Invalid email or password");
      }

      // Generate JWT
      const payload = {
        sub: employee.employee_id,
        email: employee.employee_email,
        name: employee.employee_name,
        role: employee.role_name,
        department: employee.department_name,
      };

      const token = this.jwtService.sign(payload);

      return {
        status: "success",
        message: "Login successful",
        data: {
          token: token,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}
