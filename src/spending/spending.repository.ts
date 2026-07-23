import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

@Injectable()
export class SpendingRepository {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async getReport(params: {
    minSpending?: number;
    maxSpending?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<any[]> {
    return this.dataSource.query(
      `
        SELECT
            s.spending_id,
            s.spending,
            s.spending_date,
            e.employee_name,
            d.department_name
        FROM spendings s
        INNER JOIN employees e ON s.employee_id = e.employee_id
        INNER JOIN departments d ON e.department_id = d.department_id
        WHERE ($1::numeric IS NULL OR s.spending >= $1)
          AND ($2::numeric IS NULL OR s.spending <= $2)
          AND ($3::date IS NULL OR s.spending_date >= $3::date)
          AND ($4::date IS NULL OR s.spending_date <= $4::date)
        ORDER BY s.spending_date DESC`,
      [
        params.minSpending || null,
        params.maxSpending || null,
        params.startDate || null,
        params.endDate || null,
      ],
    );
  }

  async getTotalSpending(params: {
    minSpending?: number;
    maxSpending?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<number> {
    const result = await this.dataSource.query(
      `
      SELECT 
        COALESCE(SUM(s.spending), 0) as total
      FROM spendings s
      INNER JOIN employees e ON s.employee_id = e.employee_id
      INNER JOIN departments d ON e.department_id = d.department_id
      WHERE ($1::numeric IS NULL OR s.spending >= $1)
        AND ($2::numeric IS NULL OR s.spending <= $2)
        AND ($3::date IS NULL OR s.spending_date >= $3::date)
        AND ($4::date IS NULL OR s.spending_date <= $4::date)`,
      [
        params.minSpending || null,
        params.maxSpending || null,
        params.startDate || null,
        params.endDate || null,
      ],
    );
    return parseFloat(result[0].total);
  }
}
