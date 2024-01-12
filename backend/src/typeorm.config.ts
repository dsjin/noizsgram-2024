import { DataSource } from 'typeorm'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import * as dotenv from 'dotenv'

dotenv.config({ path: __dirname + '/../.env' })

export const typeOrmConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT ? +process.env.POSTGRES_PORT : 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [__dirname + '/**/*.entity.ts', __dirname + '/**/*.entity.js'],
  subscribers: [
    __dirname + '/**/*.subscriber.ts',
    __dirname + '/**/*.subscriber.js',
  ],
  migrationsRun: process.env.RUN_MIGRATIONS === 'true',
  logging: ['development', 'local'].includes(process.env.ENV ?? '')
    ? 'all'
    : ['error', 'warn', 'info', 'log'],
  migrationsTableName: 'migration',
  migrations: [
    __dirname + '/database/migrations/**/*.ts',
    __dirname + '/database/migrations/**/*.js',
  ],
  synchronize: false,
}

export default new DataSource(typeOrmConfig)
