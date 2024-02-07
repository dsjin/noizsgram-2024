import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number
  @Column({ unique: true })
  auth0Id: string
  @Column({ unique: true, length: 30, nullable: true })
  username: string | null
  @Column({ length: 128, nullable: true })
  bio: string | null
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date
  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  updatedAt: Date | null
}
