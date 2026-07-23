import { Department } from "src/department/department.entity";
import { Role } from "src/roles/role.entity";
import { Spending } from "src/spending/spending.entity";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";

@Entity("employees")
export class Employee {
  @PrimaryGeneratedColumn()
  employee_id: number;

  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
  })
  employee_name: string;

  @Column({
    type: "varchar",
    length: 100,
    unique: true,
    nullable: false,
  })
  employee_email: string;

  @Column({
    type: "varchar",
    length: 256,
    nullable: false,
  })
  employee_password: string;

  @Column({
    type: "int",
    nullable: true,
  })
  department_id: number;

  @Column({
    type: "int",
    nullable: true,
  })
  role_id: number;

  @ManyToOne(() => Department, (department) => department.employees)
  @JoinColumn({ name: "department_id" })
  department: Department;

  @ManyToOne(() => Role, (role) => role.employees)
  @JoinColumn({ name: "role_id" })
  role: Role;

  @OneToMany(() => Spending, (spending) => spending.employee)
  spendings: Spending[];
}
