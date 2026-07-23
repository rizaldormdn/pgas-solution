import { Injectable, Logger } from "@nestjs/common";
import { EmployeeRepository } from "./employee.repository";

@Injectable()
export class EmployeeService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async create(employee: {
    employeeName: string;
    employeeEmail: string;
    employeePassword: string;
    departmentId: number;
    roleId: number;
  }) {
    try {
      const employeeExists = await this.employeeRepository.findByEmail(
        employee.employeeEmail,
      );
      if (employeeExists.length > 0) {
        throw new Error(
          `Employee with email ${employee.employeeEmail} already exists`,
        );
      }
      const result = await this.employeeRepository.create(employee);
      Logger.log(`Employee created with ID: ${result.insertId}`);
      return result;
    } catch (error) {
      Logger.error(`Error creating employee: ${error.message}`);
      throw error;
    }
  }

  async read(query: {
    page?: number;
    limit?: number;
    name?: string;
    department?: string;
  }) {
    try {
      const page = query.page || 1;
      const limit = query.limit || 10;
      const offset = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.employeeRepository.read(
          limit,
          offset,
          query.name,
          query.department,
        ),
        this.employeeRepository.count(query.name, query.department),
      ]);
      return {
        data,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      Logger.error(`Error reading employees: ${error.message}`);
      throw error;
    }
  }

  async findOne(employeeId: number) {
    try {
      const result = await this.employeeRepository.findOne(employeeId);
      if (!result) {
        throw new Error(`Employee with ID ${employeeId} not found`);
      }
      return result;
    } catch (error) {
      Logger.error(`Error finding employee: ${error.message}`);
      throw error;
    }
  }

  async update(
    employeeId: number,
    employee: {
      employeeName: string;
      employeeEmail: string;
      departmentId: number;
      roleId: number;
    },
  ) {
    try {
      const existingEmployee =
        await this.employeeRepository.findOne(employeeId);
      if (!existingEmployee) {
        throw new Error(`Employee with ID ${employeeId} not found`);
      }

      const result = await this.employeeRepository.update(employeeId, employee);
      Logger.log(`Employee updated with ID: ${employeeId}`);
      return result;
    } catch (error) {
      Logger.error(`Error updating employee: ${error.message}`);
      throw error;
    }
  }

  async delete(employeeId: number) {
    try {
      const existingEmployee =
        await this.employeeRepository.findOne(employeeId);
      if (!existingEmployee) {
        throw new Error(`Employee with ID ${employeeId} not found`);
      }
      const result = await this.employeeRepository.delete(employeeId);
      Logger.log(`Employee deleted with ID: ${employeeId}`);
      return result;
    } catch (error) {
      Logger.error(`Error deleting employee: ${error.message}`);
      throw error;
    }
  }
}
