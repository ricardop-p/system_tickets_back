import { query } from '../config/database.js';

export const getAllCategories = async () => {
  const result = await query(
    'SELECT id, name, description, is_active as active FROM categories  order by id'
  );

  return result.rows;
};

export const createCategory = async ({ name, description }) => {
  const result = await query(
    `INSERT INTO categories (name, description)
     VALUES ($1, $2)
     RETURNING *`,
    [name, description]
  );

  return result.rows[0];
};

export const updateCategory = async (id, { name, description }) => {
  const result = await query(
    `UPDATE categories
     SET name = $1, description = $2
     WHERE id = $3
     RETURNING *`,
    [name, description, id]
  );

  return result.rows[0];
};

export const changeCategoryStatus = async (id, isActive) => {
  const result = await query(
    `UPDATE categories
     SET is_active = $1
     WHERE id = $2
     RETURNING *`,
    [isActive, id]
  );

  return result.rows[0];
};
