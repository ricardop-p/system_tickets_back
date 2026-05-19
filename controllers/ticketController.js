import {
  createTicketForUser,
  getTicketDetail,
  listTicketsForUser,
} from '../services/ticketService.js';

export const getTickets = async (req, res) => {
  const tickets = await listTicketsForUser(req.user);
  return res.json(tickets);
};

export const getTicketById = async (req, res) => {
  const ticket = await getTicketDetail(req.params.id);
  return res.json(ticket);
};

export const createTicket = async (req, res) => {
  const ticket = await createTicketForUser(req.user, req.body);
  return res.status(201).json(ticket);
};
