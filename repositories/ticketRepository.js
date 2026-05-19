import { query } from '../config/database.js';

export const findAllTickets = async () => {
  const result = await query('SELECT * FROM tickets ORDER BY prioridad DESC, fecha_creacion DESC');
  return result.rows;
};

export const findTicketsByUserId = async (userId) => {
  const result = await query(
    'SELECT * FROM tickets WHERE usuario_id = $1 ORDER BY fecha_creacion DESC',
    [userId]
  );

  return result.rows;
};

export const findTicketById = async (id) => {
  const result = await query('SELECT * FROM tickets WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const createTicket = async ({ titulo, descripcion, prioridad, usuarioId }) => {
  const result = await query(
    `INSERT INTO tickets (titulo, descripcion, prioridad, estado, usuario_id, nivel_escalado, fecha_limite)
     VALUES ($1, $2, $3, 'Abierto', $4, 1, NOW() + INTERVAL '24 hours')
     RETURNING *`,
    [titulo, descripcion, prioridad, usuarioId]
  );

  return result.rows[0];
};
