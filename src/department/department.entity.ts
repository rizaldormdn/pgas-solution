import { Employee } from 'src/employee/employee.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn()
  department_id: number;

  @Column({ 
    type: 'varchar', 
    length: 100, 
    nullable: false 
  })
  department_name: string;

  @OneToMany(() => Employee, (employee) => employee.department)
  employees: Employee[];
}