import {
  assignTicketToAgent,
  createTicket,
  findCategoryById,
  findPriorityById,
  findTicketById,
  findTickets,
  findUserById,
  updateTicket,
  updateTicketStatus,
} from '../repositories/ticketRepository.js';
import { createHttpError } from '../utils/httpError.js';
import { buildAutomaticAssignment } from './assignmentService.js';
import { addSystemEvent, ensureCanAccessTicket } from './commentsService.js';
import { calculateSlaDates } from './slaService.js';

const VALID_STATUSES = [
  'OPEN',
  'ASSIGNED',
  'IN_PROGRESS',
  'ON_HOLD',
  'ESCALATED',
  'RESOLVED',
  'CLOSED',
  'CANCELLED',
];

const getUserRole = (user) => String(user?.role || user?.rol || '').toUpperCase();

const ensureAdmin = (user) => {
  if (getUserRole(user) !== 'ADMIN') {
    throw createHttpError(403, 'Solo un administrador puede realizar esta accion');
  }
};

const normalizeTicketPayload = (payload) => ({
  title: payload.title ?? payload.titulo,
  description: payload.description ?? payload.descripcion,
  category_id: payload.category_id ?? payload.categoria_id,
  priority_id: payload.priority_id ?? payload.prioridad_id,
});

const validateTicketRelations = async ({ category_id, priority_id }) => {
  const category = await findCategoryById(category_id);

  if (!category) {
    throw createHttpError(400, 'Categoria invalida o inactiva');
  }

  const priority = await findPriorityById(priority_id);

  if (!priority) {
    throw createHttpError(400, 'Prioridad invalida');
  }

  return { category, priority };
};

export const listTicketsForUser = async (user, filters = {}) => {
  const role = getUserRole(user);

  if (role === 'ADMIN') {
    return findTickets(filters, { allowAssignedAgentFilter: true });
  }

  if (role === 'AGENT') {
    return findTickets(filters, { assignedAgentId: user.id });
  }

  if (role === 'USER') {
    return findTickets(filters, { requesterId: user.id });
  }

  throw createHttpError(403, 'Rol no autorizado');
};

export const getTicketDetail = async (user, id) => {
  const ticket = await findTicketById(id);

  if (!ticket) {
    throw createHttpError(404, 'Ticket no encontrado');
  }

  ensureCanAccessTicket(user, ticket);

  return ticket;
};

export const createTicketForUser = async (user, payload) => {
  const { title, description, category_id, priority_id } = normalizeTicketPayload(payload);

  if (!title || !description || !category_id || !priority_id) {
    throw createHttpError(400, 'title, description, category_id y priority_id son obligatorios');
  }

  const { priority } = await validateTicketRelations({ category_id, priority_id });
  const { firstResponseDueAt, resolutionDueAt } = calculateSlaDates(priority);
  const assignment = await buildAutomaticAssignment();

  const ticket = await createTicket({
    title,
    description,
    requesterId: user.id,
    assignedAgentId: assignment.assignedAgentId,
    categoryId: category_id,
    priorityId: priority_id,
    status: assignment.status,
    assignedAt: assignment.assignedAt,
    firstResponseDueAt,
    resolutionDueAt,
  });

  await addSystemEvent(ticket.id, 'Ticket creado.');

  if (assignment.assignedAgentId) {
    await addSystemEvent(ticket.id, 'Ticket asignado automaticamente.');
  }

  return findTicketById(ticket.id);
};

export const editTicket = async (user, id, payload) => {
  ensureAdmin(user);

  const ticket = await findTicketById(id);

  if (!ticket) {
    throw createHttpError(404, 'Ticket no encontrado');
  }

  const fields = {
    title: payload.title ?? payload.titulo,
    description: payload.description ?? payload.descripcion,
    category_id: payload.category_id ?? payload.categoria_id,
    priority_id: payload.priority_id ?? payload.prioridad_id,
    assigned_agent_id: payload.assigned_agent_id ?? payload.agent_id,
  };

  if (fields.category_id || fields.priority_id) {
    await validateTicketRelations({
      category_id: fields.category_id || ticket.category_id,
      priority_id: fields.priority_id || ticket.priority_id,
    });
  }

  if (fields.assigned_agent_id) {
    const agent = await findUserById(fields.assigned_agent_id);

    if (!agent || agent.role !== 'AGENT' || !agent.is_active) {
      throw createHttpError(400, 'Agente invalido o inactivo');
    }
  }

  const updatedTicket = await updateTicket(id, fields);
  return findTicketById(updatedTicket.id);
};

export const changeTicketStatus = async (user, id, payload) => {
  const status = payload.status ?? payload.estado;

  if (!VALID_STATUSES.includes(status)) {
    throw createHttpError(400, 'Estado invalido');
  }

  const role = getUserRole(user);

  if (role === 'USER') {
    throw createHttpError(403, 'El usuario solicitante no puede cambiar el estado del ticket');
  }

  const ticket = await findTicketById(id);

  if (!ticket) {
    throw createHttpError(404, 'Ticket no encontrado');
  }

  ensureCanAccessTicket(user, ticket);

  const now = new Date();
  const timestamps = {};

  if (status === 'IN_PROGRESS' && !ticket.first_response_at) {
    timestamps.firstResponseAt = now;
  }

  if (status === 'RESOLVED') {
    timestamps.resolvedAt = now;
  }

  if (status === 'CLOSED') {
    timestamps.closedAt = now;
  }

  if (status === 'ESCALATED') {
    timestamps.escalatedAt = now;
    timestamps.escalationLevel = 2;
  }

  const updatedTicket = await updateTicketStatus(id, status, timestamps);

  if (status === 'RESOLVED') {
    await addSystemEvent(id, 'Ticket marcado como resuelto.');
  }

  if (status === 'CLOSED') {
    await addSystemEvent(id, 'Ticket cerrado.');
  }

  return findTicketById(updatedTicket.id);
};

export const assignTicket = async (user, id, payload) => {
  ensureAdmin(user);

  const agentId = payload.agent_id ?? payload.assigned_agent_id;

  if (!agentId) {
    throw createHttpError(400, 'agent_id es obligatorio');
  }

  const ticket = await findTicketById(id);

  if (!ticket) {
    throw createHttpError(404, 'Ticket no encontrado');
  }

  const agent = await findUserById(agentId);

  if (!agent || agent.role !== 'AGENT' || !agent.is_active) {
    throw createHttpError(400, 'Agente invalido o inactivo');
  }

  const updatedTicket = await assignTicketToAgent(id, agentId);
  await addSystemEvent(id, 'Ticket reasignado por administrador.');

  return findTicketById(updatedTicket.id);
};
