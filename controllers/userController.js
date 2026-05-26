import { createUser as createUserService, listUsers } from '../services/userService.js';

export const getUsers = async (req, res) => {
  const users = await listUsers(req.user);
  return res.json(users);
};

export const createUser = async (req, res) => {
  const user = await createUserService(req.user, req.body);
  return res.status(201).json(user);
};
