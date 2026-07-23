import { DataSource } from "typeorm";
import { Injectable, Logger } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";

@Injectable()
export class DepartmentRepository {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(department: { departmentName: string }) {
    return this.dataSource.query(
      `INSERT INTO departments (department_name) VALUES ($1)`,
      [department.departmentName],
    );
  }

  async read(limit: number, offset: number): Promise<any[]> {
    return this.dataSource.query(
      `SELECT department_id, department_name FROM departments ORDER BY department_id ASC LIMIT $1 OFFSET $2`,
      [limit, offset],
    );
  }

  async count(): Promise<number> {
    const result = await this.dataSource.query(
      `SELECT COUNT(*) FROM departments`,
    );
    return parseInt(result[0].count);
  }

  async findOne(departmentId: number) {
    const result = await this.dataSource.query(
      `SELECT department_id, department_name FROM departments WHERE department_id = $1`,
      [departmentId],
    );
    Logger.log(`Department found with ID: ${departmentId}`);
    return result;
  }

  async findDepartmentName(departmentName: string) {
    return this.dataSource.query(
      `SELECT department_id, department_name FROM departments WHERE department_name = $1`,
      [departmentName],
    );
  }

  async update(departmentId: number, department: { departmentName: string }) {
    return this.dataSource.query(
      `UPDATE departments SET department_name = $1 WHERE department_id = $2`,
      [department.departmentName, departmentId],
    );
  }

  async delete(departmentId: number) {
    return this.dataSource.query(
      `DELETE FROM departments WHERE department_id = $1`,
      [departmentId],
    );
  }
}
