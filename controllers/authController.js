import { loginUser } from '../services/authService.js';

export const login = async (req, res) => {
  const result = await loginUser(req.body);
  return res.json(result);
};
