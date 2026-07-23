import { Injectable, Logger } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

@Injectable()
export class EmployeeRepository {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}
  async create(employee: {
    employeeName: string;
    employeeEmail: string;
    employeePassword: string;
    departmentId: number;
    roleId: number;
  }) {
    return this.dataSource.query(
      `INSERT INTO employees (
        employee_name,
        employee_email, 
        employee_password, 
        department_id, 
        role_id
    ) VALUES ($1, $2, $3, $4, $5)`,
      [
        employee.employeeName,
        employee.employeeEmail,
        employee.employeePassword,
        employee.departmentId,
        employee.roleId,
      ],
    );
  }

  async read(
    limit: number,
    offset: number,
    name?: string,
    department?: string,
  ): Promise<any[]> {
    return this.dataSource.query(
      `
        SELECT
            e.employee_id,
            e.employee_name,
            e.employee_email,
            d.department_name,
            r.role_name
        FROM employees e
        INNER JOIN departments d ON e.department_id = d.department_id
        INNER JOIN roles r ON e.role_id = r.role_id
        WHERE ($1::text IS NULL OR e.employee_name ILIKE '%' || $1 || '%')
        AND ($2::text IS NULL OR d.department_name ILIKE '%' || $2 || '%')
        ORDER BY e.employee_id ASC
        LIMIT $3 OFFSET $4`,
      [name || null, department || null, limit, offset],
    );
  }

  async count(name?: string, department?: string): Promise<number> {
    const result = await this.dataSource.query(
      `
        SELECT COUNT(*) AS count
        FROM employees e
        INNER JOIN departments d ON e.department_id = d.department_id
        INNER JOIN roles r ON e.role_id = r.role_id
        WHERE ($1::text IS NULL OR e.employee_name ILIKE '%' || $1 || '%')
        AND ($2::text IS NULL OR d.department_name ILIKE '%' || $2 || '%')`,
      [name || null, department || null],
    );
    return parseInt(result[0].count, 10);
  }

  async findByEmail(employeeEmail: string): Promise<any> {
    const result = await this.dataSource.query(
      `
        SELECT
            e.employee_id,
            e.employee_name,
            e.employee_email,
            e.employee_password,
            d.department_name,
            r.role_name
        FROM employees e
        INNER JOIN departments d ON e.department_id = d.department_id
        INNER JOIN roles r ON e.role_id = r.role_id
        WHERE e.employee_email = $1
      `,
      [employeeEmail],
    );
    Logger.log(`findByEmail result: ${JSON.stringify(result)}`);
    return result[0] || null;
  }

  async findOne(id: number): Promise<any> {
    const result = await this.dataSource.query(
      `
        SELECT
            e.employee_id,
            e.employee_name,
            e.employee_email,
            d.department_name,
            r.role_name
        FROM employees e
        INNER JOIN departments d ON e.department_id = d.department_id
        INNER JOIN roles r ON e.role_id = r.role_id
        WHERE e.employee_id = $1
      `,
      [id],
    );
    return result[0] || null;
  }
  async update(
    id: number,
    employee: {
      employeeName: string;
      employeeEmail: string;
      departmentId: number;
      roleId: number;
    },
  ): Promise<any> {
    return this.dataSource.query(
      `
        UPDATE employees
        SET employee_name = $1, employee_email = $2, department_id = $3, role_id = $4
        WHERE employee_id = $5
      `,
      [
        employee.employeeName,
        employee.employeeEmail,
        employee.departmentId,
        employee.roleId,
        id,
      ],
    );
  }
  async delete(id: number): Promise<any> {
    return this.dataSource.query(
      `
        DELETE FROM employees
        WHERE employee_id = $1
      `,
      [id],
    );
  }
}
