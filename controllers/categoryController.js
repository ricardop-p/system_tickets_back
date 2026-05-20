import {
  createCategory as createCategoryService,
  editCategory,
  listCategories,
  toggleCategoryStatus,
} from '../services/categoryService.js';

export const createCategory = async (req, res) => {
  const result = await createCategoryService(req.body);
  return res.status(201).json(result);
};

export const getCategories = async (req, res) => {
  const result = await listCategories();
  return res.json(result);
};

export const updateCategory = async (req, res) => {
  const result = await editCategory(req.body);
  return res.json(result);
};

export const changeCategoryStatus = async (req, res) => {
  const result = await toggleCategoryStatus(req.body);
  return res.json(result);
};
