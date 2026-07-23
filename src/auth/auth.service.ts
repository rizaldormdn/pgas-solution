import {
  BadRequestException,
  Injectable,
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
    const hashedPassword = await bcrypt.hash(dto.employeePassword, 10);
    const existingEmployee = await this.employeeRepository.findByEmail(
      dto.employeeEmail,
    );

    if (existingEmployee) {
      throw new BadRequestException("Email already exists");
    }
    await this.employeeRepository.create({
      ...dto,
      employeePassword: hashedPassword,
    });
    return {
      status: "success",
      message: "Employee registered successfully",
    };
  }
  async login(dto: { employeeEmail: string; employeePassword: string }) {
    const employee = await this.employeeRepository.findByEmail(
      dto.employeeEmail,
    );
    if (!employee) {
      throw new BadRequestException("Invalid email or password");
    }
    const isMatch = await bcrypt.compare(
      dto.employeePassword,
      employee.employeePassword,
    );
    if (!isMatch) {
      throw new BadRequestException("Invalid email or password");
    }
    const payload = {
      sub: employee.employee_id,
      email: employee.employee_email,
      role: employee.role_name,
    };

    const token = this.jwtService.sign(payload);

    const { employee_password, ...employeeData } = employee;

    return {
      status: "success",
      message: "Login successful",
      token: token,
    };
  }
}
