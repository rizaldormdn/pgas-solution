import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Spending } from "src/spending/spending.entity";
import { Employee } from "src/employee/employee.entity";
import { Department } from "src/department/department.entity";
import { Role } from "src/roles/role.entity";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("DB_HOST"),
        port: configService.get<number>("DB_PORT"),
        username: configService.get<string>("DB_USERNAME"),
        password: configService.get<string>("DB_PASSWORD"),
        database: configService.get<string>("DB_DATABASE"),
      entities: [Role, Department, Employee, Spending],
        synchronize: configService.get("NODE_ENV") !== "production",
      }),
    }),
  ],
})
export class DatabaseModule {}
