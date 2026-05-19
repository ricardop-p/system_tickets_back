import { checkDatabaseConnection } from '../config/database.js';

export const getApiHealth = () => ({
  status: 'ok',
  service: 'system-tickets-back',
});

export const getDatabaseHealth = async () => {
  const result = await checkDatabaseConnection();

  return {
    status: 'ok',
    database: 'connected',
    currentTime: result.current_time,
  };
};
