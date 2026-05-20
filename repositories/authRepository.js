import { query } from '../config/database.js';

export const findUserByEmail = async (email) => {
  const result = await query(
    `SELECT id, name AS nombre, email, password_hash AS password, role AS rol FROM users WHERE email = $1`,
    [email]
  );

  return result.rows[0] || null;
};
