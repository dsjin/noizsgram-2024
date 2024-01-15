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
  @Column({ unique: true, length: 30 })
  username: string
  @Column({ unique: true, length: 128 })
  bio: string
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: number
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: number
}
