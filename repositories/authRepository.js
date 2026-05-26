import { query } from '../config/database.js';

export const findUserByEmail = async (email) => {
  const result = await query(
    `SELECT id, name AS nombre, email, password_hash AS password, role AS rol
     FROM users
     WHERE email = $1`,
    [email]
  );

  return result.rows[0] || null;
};

export const findAllUsers = async () => {
  const result = await query(
    `SELECT id, name, email, role, is_active
     FROM users
     ORDER BY role ASC, name ASC`
  );

  return result.rows;
};

export const createUser = async ({ name, email, passwordHash, role, isActive, age }) => {
  const result = await query(
    `INSERT INTO users (name, email, password_hash, role, is_active, age)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, name, email, role, is_active, age`,
    [name, email, passwordHash, role, isActive, age]
  );

  return result.rows[0];
};
