import { Knex } from 'knex';

const config: Knex.Config = {
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'pass',
    database: 'yaur',
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: __dirname + '/migrations'
  },
};

export default config;