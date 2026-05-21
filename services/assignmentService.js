import { findAgentWithLowestLoad } from '../repositories/ticketRepository.js';

export const findAgentWithLowestTicketLoad = async () => findAgentWithLowestLoad();

export const buildAutomaticAssignment = async () => {
  const agent = await findAgentWithLowestTicketLoad();

  if (!agent) {
    return {
      assignedAgentId: null,
      assignedAt: null,
      status: 'OPEN',
    };
  }

  return {
    assignedAgentId: agent.id,
    assignedAt: new Date(),
    status: 'ASSIGNED',
  };
};
