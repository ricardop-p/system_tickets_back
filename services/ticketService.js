import {
  createTicket,
  findAllTickets,
  findTicketById,
  findTicketsByUserId,
} from '../repositories/ticketRepository.js';
import { createHttpError } from '../utils/httpError.js';

const VALID_PRIORITIES = ['Baja', 'Media', 'Alta'];

export const listTicketsForUser = async (user) => {
  if (user.rol === 'usuario') {
    return findTicketsByUserId(user.id);
  }

  return findAllTickets();
};

export const getTicketDetail = async (id) => {
  const ticket = await findTicketById(id);

  if (!ticket) {
    throw createHttpError(404, 'Ticket no encontrado');
  }

  return ticket;
};

export const createTicketForUser = async (user, payload) => {
  const titulo = payload.titulo ?? payload.title;
  const descripcion = payload.descripcion ?? payload.description;
  const { prioridad } = payload;

  if (!titulo || !prioridad) {
    throw createHttpError(400, 'Titulo y prioridad son obligatorios');
  }

  if (!VALID_PRIORITIES.includes(prioridad)) {
    throw createHttpError(400, 'Prioridad invalida');
  }

  return createTicket({
    titulo,
    descripcion,
    prioridad,
    usuarioId: user.id,
  });
};
