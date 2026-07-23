import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EmployeeRepository } from "src/employee/employee.repository";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly employeeRepository: EmployeeRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>("JWT_SECRET") || "default_secret",
    });
  }
  async validate(payload: any) {
    const employee = await this.employeeRepository.findOne(payload.sub);
    if (!employee) {
      throw new UnauthorizedException();
    }
    return employee;
  }
}
