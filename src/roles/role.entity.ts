import { Employee } from "src/employee/employee.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity("roles")
export class Role {
  @PrimaryGeneratedColumn()
  role_id: number;

  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
  })
  role_name: string;

  @OneToMany(() => Employee, (employee) => employee.role)
  employees: Employee[];
}
