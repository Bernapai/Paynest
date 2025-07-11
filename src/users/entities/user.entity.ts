import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  role: string;

  @CreateDateColumn()
  createdAt: Date;
}
export default User;
