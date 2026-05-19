import pool from '../db.js';

export const checkDatabaseConnection = async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS current_time');

    return res.status(200).json({
      status: 'ok',
      database: 'connected',
      currentTime: result.rows[0].current_time
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      database: 'disconnected',
      message: 'No se pudo conectar con la base de datos',
      error: err.message
    });
  }
};
