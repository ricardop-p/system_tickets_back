import dotenv from 'dotenv';

dotenv.config();

const toNumber = (value, defaultValue) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : defaultValue;
};

const toBoolean = (value, defaultValue = false) => {
  if (value === undefined) return defaultValue;
  return value === 'true';
};

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: toNumber(process.env.PORT, 8007),
  jwtSecret: process.env.JWT_SECRET || 'firma_secreta',
  databaseUrl: process.env.DATABASE_URL || process.env.DB_URL,
  db: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: toNumber(process.env.DB_PORT, 5432),
    poolMax: toNumber(process.env.DB_POOL_MAX, 10),
    connectionTimeoutMillis: toNumber(process.env.DB_CONNECTION_TIMEOUT_MS, 5000),
    idleTimeoutMillis: toNumber(process.env.DB_IDLE_TIMEOUT_MS, 30000),
    queryTimeoutMillis: toNumber(process.env.DB_QUERY_TIMEOUT_MS, 5000),
    ssl: toBoolean(process.env.DB_SSL),
    sslRejectUnauthorized: toBoolean(process.env.DB_SSL_REJECT_UNAUTHORIZED, true),
  },
};
