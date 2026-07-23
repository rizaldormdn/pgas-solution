import { Employee } from "src/employee/employee.entity";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

@Entity("spendings")
export class Spending {
  @PrimaryGeneratedColumn()
  spending_id: number;

  @Column({
    type: "decimal",
    precision: 12,
    scale: 2,
    nullable: false,
  })
  spending: number;

  @Column({
    type: "int",
    nullable: true,
  })
  employee_id: number;

  @Column({
    type: "date",
    nullable: true,
  })
  spending_date: Date;

  @ManyToOne(() => Employee, (employee) => employee.spendings)
  @JoinColumn({ name: "employee_id" })
  employee: Employee;
}
