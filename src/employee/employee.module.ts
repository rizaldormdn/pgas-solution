import { Module } from "@nestjs/common";
import { EmployeeRepository } from "./employee.repository";
import { EmployeeService } from "./employee.service";
import { EmployeeController } from "./employee.controller";

@Module({
  imports: [],
  controllers: [EmployeeController],
  providers: [EmployeeRepository, EmployeeService],
  exports: [EmployeeRepository],
})
export class EmployeeModule {}
