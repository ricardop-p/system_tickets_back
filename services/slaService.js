import {
  escalateTicket,
  findBreachedResolutionTickets,
  findExpiredFirstResponseTickets,
} from '../repositories/ticketRepository.js';
import { addSystemEvent } from './commentsService.js';

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + Number(days));
  return result;
};

export const calculateSlaDates = (priority, from = new Date()) => ({
  firstResponseDueAt: addDays(from, priority.response_days),
  resolutionDueAt: addDays(from, priority.resolution_days),
});

export const checkExpiredTickets = async () => {
  const escalated = [];
  const firstResponseExpired = await findExpiredFirstResponseTickets();

  for (const ticket of firstResponseExpired) {
    const reason = 'Escalado automatico por vencimiento de primera atencion';
    const updatedTicket = await escalateTicket(ticket.id, 'EXPIRED', reason);
    await addSystemEvent(ticket.id, reason);
    escalated.push(updatedTicket);
  }

  const resolutionBreached = await findBreachedResolutionTickets();

  for (const ticket of resolutionBreached) {
    if (escalated.some((item) => Number(item.id) === Number(ticket.id))) continue;

    const reason = 'SLA incumplido por vencimiento de resolucion';
    const updatedTicket = await escalateTicket(ticket.id, 'BREACHED', reason);
    await addSystemEvent(ticket.id, reason);
    escalated.push(updatedTicket);
  }

  return escalated;
};
