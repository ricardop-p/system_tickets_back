import {
  changeCategoryStatus,
  createCategory as createCategoryRepository,
  getAllCategories,
  updateCategory,
} from '../repositories/categoryRepository.js';
import { createHttpError } from '../utils/httpError.js';

export const createCategory = async (payload) => {
  const { name, description } = payload;

  if (!name) {
    throw createHttpError(400, 'El nombre de la categoria es obligatorio');
  }

  return createCategoryRepository({ name, description });
};

export const listCategories = async () => getAllCategories();

export const toggleCategoryStatus = async (payload) => {
  const { id, isActive } = payload;

  if (!id) {
    throw createHttpError(400, 'El id de la categoria es obligatorio');
  }

  if (typeof isActive !== 'boolean') {
    throw createHttpError(400, 'isActive debe ser true o false');
  }

  const category = await changeCategoryStatus(id, isActive);

  if (!category) {
    throw createHttpError(404, 'Categoria no encontrada');
  }

  return category;
};

export const editCategory = async (payload) => {
  const { id, name, description } = payload;

  if (!id) {
    throw createHttpError(400, 'El id de la categoria es obligatorio');
  }

  if (!name) {
    throw createHttpError(400, 'El nombre de la categoria es obligatorio');
  }

  const category = await updateCategory(id, { name, description });

  if (!category) {
    throw createHttpError(404, 'Categoria no encontrada');
  }

  return category;
};
