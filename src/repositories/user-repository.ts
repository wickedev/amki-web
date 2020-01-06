import { createConnection } from 'typeorm'
import { Repository } from 'typeorm/repository/Repository'
import { UserTable } from '~/models/tables/user'
import { User } from '~/models/entities/User'

export const connection = createConnection({
    type: 'postgres',
    host: process.env.AMKI_WEB_POSTGRESQL_SERVICE_HOST || 'localhost',
    port: Number(process.env.AMKI_WEB_POSTGRESQL_SERVICE_PORT) || 5432,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    entities: [UserTable],
    synchronize: true,
    logging: false,
})

export async function getUserRepository(): Promise<Repository<User>> {
    const conn = await connection
    return conn.getRepository(UserTable)
}
