import { query } from '../config/database.js';

export const findUserByEmail = async (email) => {
  const result = await query(
    'SELECT id, nombre, email, password, rol FROM usuarios WHERE email = $1',
    [email]
  );

  return result.rows[0] || null;
};
