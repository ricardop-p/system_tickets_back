import pg from 'pg';

import { env } from './env.js';

const { Pool } = pg;

const createPoolConfig = () => {
  const poolConfig = env.databaseUrl
    ? {
        connectionString: env.databaseUrl,
      }
    : {
        user: env.db.user,
        host: env.db.host,
        database: env.db.database,
        password: env.db.password,
        port: env.db.port,
      };

  Object.assign(poolConfig, {
    max: env.db.poolMax,
    connectionTimeoutMillis: env.db.connectionTimeoutMillis,
    idleTimeoutMillis: env.db.idleTimeoutMillis,
    query_timeout: env.db.queryTimeoutMillis,
  });

  if (env.db.ssl) {
    poolConfig.ssl = {
      rejectUnauthorized: env.db.sslRejectUnauthorized,
    };
  }

  return poolConfig;
};

const pool = new Pool(createPoolConfig());

pool.on('error', (err) => {
  console.error('Error inesperado en la conexion de PostgreSQL:', err.message);
});

export const query = (text, params) => pool.query(text, params);

export const checkDatabaseConnection = async () => {
  const result = await query('SELECT NOW() AS current_time');
  return result.rows[0];
};

export default pool;
