import { checkSeniority, getPriorities } from '../services/variusService.js';

export const getPriority = async (req, res) => {
  return res.status(200).json(getPriorities());
};

export const getSeniority = (req, res) => {
  return res.json(checkSeniority(req.query.years));
};
