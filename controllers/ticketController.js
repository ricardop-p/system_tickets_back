import { addComment, getCommentsByTicket } from '../services/commentsService.js';
import {
  assignTicket as assignTicketService,
  changeTicketStatus as changeTicketStatusService,
  createTicketForUser,
  editTicket,
  getTicketDetail,
  listTicketsForUser,
} from '../services/ticketService.js';

export const getTickets = async (req, res) => {
  const tickets = await listTicketsForUser(req.user, req.query);
  return res.json(tickets);
};

export const getTicketById = async (req, res) => {
  const ticket = await getTicketDetail(req.user, req.params.id);
  return res.json(ticket);
};

export const createTicket = async (req, res) => {
  const ticket = await createTicketForUser(req.user, req.body);
  return res.status(201).json(ticket);
};

export const updateTicket = async (req, res) => {
  const ticket = await editTicket(req.user, req.params.id, req.body);
  return res.json(ticket);
};

export const changeTicketStatus = async (req, res) => {
  const ticket = await changeTicketStatusService(req.user, req.params.id, req.body);
  return res.json(ticket);
};

export const assignTicket = async (req, res) => {
  const ticket = await assignTicketService(req.user, req.params.id, req.body);
  return res.json(ticket);
};

export const createTicketComment = async (req, res) => {
  const comment = await addComment(req.user, req.params.id, req.body);
  return res.status(201).json(comment);
};

export const getTicketComments = async (req, res) => {
  const comments = await getCommentsByTicket(req.user, req.params.id);
  return res.json(comments);
};
