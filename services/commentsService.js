import {
  addTicketComment,
  findCommentsByTicketId,
  findTicketById,
} from '../repositories/ticketRepository.js';
import { createHttpError } from '../utils/httpError.js';

const getUserRole = (user) => String(user?.role || user?.rol || '').toUpperCase();

export const canAccessTicket = (user, ticket) => {
  const role = getUserRole(user);
  const userId = Number(user?.id);

  if (role === 'ADMIN') return true;
  if (role === 'AGENT') return Number(ticket.assigned_agent_id) === userId;
  if (role === 'USER') return Number(ticket.requester_id) === userId;

  return false;
};

export const ensureCanAccessTicket = (user, ticket) => {
  if (!canAccessTicket(user, ticket)) {
    throw createHttpError(403, 'No tienes permisos para acceder a este ticket');
  }
};

export const addSystemEvent = async (ticketId, comment) => addTicketComment({
  ticketId,
  userId: null,
  comment,
  commentType: 'SYSTEM_EVENT',
});

export const addComment = async (user, ticketId, payload) => {
  const comment = payload.comment ?? payload.comentario;

  if (!comment) {
    throw createHttpError(400, 'El comentario es obligatorio');
  }

  const ticket = await findTicketById(ticketId);

  if (!ticket) {
    throw createHttpError(404, 'Ticket no encontrado');
  }

  ensureCanAccessTicket(user, ticket);

  return addTicketComment({
    ticketId,
    userId: user.id,
    comment,
    commentType: 'USER_COMMENT',
  });
};

export const getCommentsByTicket = async (user, ticketId) => {
  const ticket = await findTicketById(ticketId);

  if (!ticket) {
    throw createHttpError(404, 'Ticket no encontrado');
  }

  ensureCanAccessTicket(user, ticket);

  return findCommentsByTicketId(ticketId);
};
