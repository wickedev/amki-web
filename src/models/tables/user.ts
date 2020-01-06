import { User } from '~/models/entities/User'
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class UserTable extends User {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    firstName!: string

    @Column()
    lastName!: string

    @Column()
    age!: number
}
