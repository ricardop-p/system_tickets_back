import { query } from '../config/database.js';

const TICKET_SELECT = `
  SELECT
    t.*,
    c.name AS category_name,
    p.name AS priority_name,
    p.level AS priority_level,
    requester.name AS requester_name,
    agent.name AS assigned_agent_name
  FROM tickets t
  INNER JOIN categories c ON c.id = t.category_id
  INNER JOIN priorities p ON p.id = t.priority_id
  INNER JOIN users requester ON requester.id = t.requester_id
  LEFT JOIN users agent ON agent.id = t.assigned_agent_id
`;

const ACTIVE_STATUSES = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'ON_HOLD', 'ESCALATED'];

const buildTicketFilters = (filters = {}, options = {}) => {
  const where = [];
  const values = [];

  const addFilter = (column, value) => {
    if (value === undefined || value === null || value === '') return;
    values.push(value);
    where.push(`${column} = $${values.length}`);
  };

  addFilter('t.status', filters.status);
  addFilter('t.sla_status', filters.sla_status);
  addFilter('t.priority_id', filters.priority_id);
  addFilter('t.category_id', filters.category_id);

  if (options.requesterId) {
    addFilter('t.requester_id', options.requesterId);
  }

  if (options.assignedAgentId) {
    addFilter('t.assigned_agent_id', options.assignedAgentId);
  } else if (options.allowAssignedAgentFilter) {
    addFilter('t.assigned_agent_id', filters.assigned_agent_id);
  }

  return {
    whereClause: where.length ? `WHERE ${where.join(' AND ')}` : '',
    values,
  };
};

export const findTickets = async (filters, options) => {
  const { whereClause, values } = buildTicketFilters(filters, options);
  const result = await query(
    `${TICKET_SELECT}
     ${whereClause}
     ORDER BY p.level DESC, t.created_at DESC`,
    values
  );

  return result.rows;
};

export const findTicketById = async (id) => {
  const result = await query(`${TICKET_SELECT} WHERE t.id = $1`, [id]);
  return result.rows[0] || null;
};

export const findPriorityById = async (id) => {
  const result = await query('SELECT * FROM priorities WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const findAllPriorities = async () => {
  const result = await query(
    `SELECT id, name, response_days, resolution_days, level
     FROM priorities
     ORDER BY level ASC`
  );
  return result.rows;
};

export const findCategoryById = async (id) => {
  const result = await query('SELECT * FROM categories WHERE id = $1 AND is_active = true', [id]);
  return result.rows[0] || null;
};

export const findUserById = async (id) => {
  const result = await query('SELECT id, name, email, role, is_active FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const findAgentWithLowestLoad = async () => {
  const result = await query(
    `SELECT
       u.id,
       COUNT(t.id) AS active_tickets
     FROM users u
     LEFT JOIN tickets t
       ON t.assigned_agent_id = u.id
      AND t.status = ANY($1)
     WHERE u.role = 'AGENT'
       AND u.is_active = true
     GROUP BY u.id
     ORDER BY active_tickets ASC, u.id ASC
     LIMIT 1`,
    [ACTIVE_STATUSES]
  );

  return result.rows[0] || null;
};

export const createTicket = async ({
  title,
  description,
  requesterId,
  assignedAgentId,
  categoryId,
  priorityId,
  status,
  assignedAt,
  firstResponseDueAt,
  resolutionDueAt,
}) => {
  const result = await query(
    `INSERT INTO tickets (
       title,
       description,
       status,
       sla_status,
       requester_id,
       assigned_agent_id,
       category_id,
       priority_id,
       assigned_at,
       first_response_due_at,
       resolution_due_at,
       escalation_level
     )
     VALUES ($1, $2, $3, 'ON_TIME', $4, $5, $6, $7, $8, $9, $10, 1)
     RETURNING *`,
    [
      title,
      description,
      status,
      requesterId,
      assignedAgentId,
      categoryId,
      priorityId,
      assignedAt,
      firstResponseDueAt,
      resolutionDueAt,
    ]
  );

  return result.rows[0];
};

export const updateTicket = async (id, fields) => {
  const allowedFields = {
    title: 'title',
    description: 'description',
    category_id: 'category_id',
    priority_id: 'priority_id',
    assigned_agent_id: 'assigned_agent_id',
  };

  const entries = Object.entries(fields).filter(
    ([key, value]) => allowedFields[key] && value !== undefined
  );

  if (!entries.length) {
    return findTicketById(id);
  }

  const setClauses = entries.map(([key], index) => `${allowedFields[key]} = $${index + 1}`);
  const values = entries.map(([, value]) => value);
  values.push(id);

  const result = await query(
    `UPDATE tickets
     SET ${setClauses.join(', ')}
     WHERE id = $${values.length}
     RETURNING *`,
    values
  );

  return result.rows[0] || null;
};

export const updateTicketStatus = async (id, status, timestamps = {}) => {
  const result = await query(
    `UPDATE tickets
     SET
       status = $1,
       first_response_at = COALESCE(first_response_at, $2),
       resolved_at = COALESCE($3, resolved_at),
       closed_at = COALESCE($4, closed_at),
       escalated_at = COALESCE($5, escalated_at),
       escalation_level = COALESCE($6, escalation_level)
     WHERE id = $7
     RETURNING *`,
    [
      status,
      timestamps.firstResponseAt || null,
      timestamps.resolvedAt || null,
      timestamps.closedAt || null,
      timestamps.escalatedAt || null,
      timestamps.escalationLevel || null,
      id,
    ]
  );

  return result.rows[0] || null;
};

export const assignTicketToAgent = async (id, agentId) => {
  const result = await query(
    `UPDATE tickets
     SET assigned_agent_id = $1,
         assigned_at = NOW(),
         status = 'ASSIGNED'
     WHERE id = $2
     RETURNING *`,
    [agentId, id]
  );

  return result.rows[0] || null;
};

export const findExpiredFirstResponseTickets = async () => {
  const result = await query(
    `SELECT *
     FROM tickets
     WHERE first_response_at IS NULL
       AND NOW() > first_response_due_at
       AND status NOT IN ('RESOLVED', 'CLOSED', 'CANCELLED')`
  );

  return result.rows;
};

export const findBreachedResolutionTickets = async () => {
  const result = await query(
    `SELECT *
     FROM tickets
     WHERE resolved_at IS NULL
       AND NOW() > resolution_due_at
       AND status NOT IN ('RESOLVED', 'CLOSED', 'CANCELLED')`
  );

  return result.rows;
};

export const escalateTicket = async (id, slaStatus, escalationReason) => {
  const result = await query(
    `UPDATE tickets
     SET status = 'ESCALATED',
         sla_status = $1,
         escalated_at = NOW(),
         escalation_level = 2,
         escalation_reason = $2
     WHERE id = $3
     RETURNING *`,
    [slaStatus, escalationReason, id]
  );

  return result.rows[0] || null;
};

export const addTicketComment = async ({ ticketId, userId, comment, commentType }) => {
  const result = await query(
    `INSERT INTO ticket_comments (ticket_id, user_id, comment, comment_type)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [ticketId, userId, comment, commentType]
  );

  return result.rows[0];
};

export const findCommentsByTicketId = async (ticketId) => {
  const result = await query(
    `SELECT
       tc.*,
       u.name AS user_name,
       u.role AS user_role
     FROM ticket_comments tc
     LEFT JOIN users u ON u.id = tc.user_id
     WHERE tc.ticket_id = $1
     ORDER BY tc.created_at ASC, tc.id ASC`,
    [ticketId]
  );

  return result.rows;
};
