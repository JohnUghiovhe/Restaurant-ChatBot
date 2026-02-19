import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  deviceId: string;

  @Column({ nullable: true })
  currentOrderId: string;

  // Simple conversation state to disambiguate "1" (menu item) vs main menu option
  @Column({ default: 'main' })
  mode: 'main' | 'menu';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
