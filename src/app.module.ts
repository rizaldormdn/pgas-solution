import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module";
import { EmployeeModule } from "./employee/employee.module";
import { AuthModule } from "./auth/auth.module";
import { DepartmentModule } from "./department/department.module";
import { SpendingModule } from "./spending/spending.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    DatabaseModule,
    EmployeeModule,
    AuthModule,
    DepartmentModule,
    SpendingModule,
  ],
})
export class AppModule {}
