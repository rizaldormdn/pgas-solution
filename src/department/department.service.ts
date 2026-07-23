import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { DepartmentRepository } from "./department.repository";

@Injectable()
export class DepartmentService {
  constructor(private readonly departmentRepository: DepartmentRepository) {}

  async create(department: { departmentName: string }) {
    try {
      const departmentExists =
        await this.departmentRepository.findDepartmentName(
          department.departmentName,
        );

      if (departmentExists.length > 0) {
        throw new ConflictException(
          `Department with name ${department.departmentName} already exists`,
        );
      }

      const result = await this.departmentRepository.create(department);
      Logger.log(`Department created with ID: ${result.insertId}`);

      return result;
    } catch (error) {
      Logger.error(`Error creating department: ${error.message}`);
      throw error;
    }
  }
  async read(query: { page?: number; limit?: number }) {
    try {
      const page = query.page || 1;
      const limit = query.limit || 10;
      const offset = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.departmentRepository.read(limit, offset),
        this.departmentRepository.count(),
      ]);
      return {
        data,
        meta: {
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      Logger.error(`Error reading departments: ${error.message}`);
      throw error;
    }
  }
  async findOne(departmentId: number) {
    try {
      const result = await this.departmentRepository.findOne(departmentId);
      Logger.log(`Department found with ID: ${departmentId}`);
      if (result.length === 0) {
        throw new NotFoundException(
          `Department with ID ${departmentId} not found`,
        );
      }
      return {
        data: result[0],
      };
    } catch (error) {
      Logger.error(
        `Error finding department with ID ${departmentId}: ${error.message}`,
      );
      throw error;
    }
  }
  async update(departmentId: number, department: { departmentName: string }) {
    try {
      const department = await this.departmentRepository.findOne(departmentId);
      if (!department) {
        throw new NotFoundException(
          `Department with ID ${departmentId} not found`,
        );
      }
      const result = await this.departmentRepository.update(
        departmentId,
        department.departmentName,
      );
      Logger.log(`Department updated with ID: ${departmentId}`);
      return result;
    } catch (error) {
      Logger.error(`Error updating department: ${error.message}`);
      throw error;
    }
  }
  async delete(departmentId: number) {
    try {
      const department = await this.departmentRepository.findOne(departmentId);
      if (!department) {
        throw new NotFoundException(
          `Department with ID ${departmentId} not found`,
        );
      }
      const result = await this.departmentRepository.delete(departmentId);
      Logger.log(`Department deleted with ID: ${departmentId}`);
      return result;
    } catch (error) {
      Logger.error(`Error deleting department: ${error.message}`);
      throw error;
    }
  }
}
