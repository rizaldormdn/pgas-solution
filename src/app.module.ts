import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module";
import { EmployeeModule } from "./employee/employee.module";
import { AuthModule } from "./auth/auth.module";
import { DepartmentModule } from "./department/department.module";
import { SpendingModule } from "./spending/spending.module";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";

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
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
