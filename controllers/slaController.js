import { checkExpiredTickets, getSlaPolicies as fetchSlaPolicies } from '../services/slaService.js';
import { createHttpError } from '../utils/httpError.js';

const getUserRole = (user) => String(user?.role || user?.rol || '').toUpperCase();

export const getSlaPolicies = async (req, res) => {
  const policies = await fetchSlaPolicies();
  return res.json(policies);
};

export const checkExpiredSla = async (req, res) => {
  if (getUserRole(req.user) !== 'ADMIN') {
    throw createHttpError(403, 'Solo un administrador puede ejecutar la revision SLA');
  }

  const tickets = await checkExpiredTickets();

  return res.json({
    escalated_count: tickets.length,
    tickets,
  });
};
