import { getApiHealth, getDatabaseHealth } from '../services/healthService.js';

export const checkApiHealth = (req, res) => {
  return res.status(200).json(getApiHealth());
};

export const checkDatabaseConnection = async (req, res) => {
  try {
    return res.status(200).json(await getDatabaseHealth());
  } catch (err) {
    console.error('Error al validar la conexion con la base de datos:', err.message);

    return res.status(500).json({
      status: 'error',
      database: 'disconnected',
      message: 'No se pudo conectar con la base de datos',
      error: err.message,
    });
  }
};
