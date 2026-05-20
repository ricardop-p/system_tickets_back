CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT users_role_check
    CHECK (role IN ('ADMIN', 'AGENT', 'USER'))
);

CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE priorities (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    response_days INTEGER NOT NULL,
    resolution_days INTEGER NOT NULL,
    level INTEGER NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT priorities_response_days_check
    CHECK (response_days > 0),

    CONSTRAINT priorities_resolution_days_check
    CHECK (resolution_days > 0),

    CONSTRAINT priorities_resolution_gte_response_check
    CHECK (resolution_days >= response_days)
);

CREATE TABLE tickets (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'OPEN',
    sla_status VARCHAR(30) NOT NULL DEFAULT 'ON_TIME',

    requester_id BIGINT NOT NULL,
    assigned_agent_id BIGINT,

    category_id BIGINT NOT NULL,
    priority_id BIGINT NOT NULL,

    assigned_at TIMESTAMPTZ,
    first_response_due_at TIMESTAMPTZ NOT NULL,
    resolution_due_at TIMESTAMPTZ NOT NULL,
    first_response_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,

    escalated_at TIMESTAMPTZ,
    escalation_level INTEGER NOT NULL DEFAULT 1,
    escalation_reason TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT tickets_status_check
    CHECK (
        status IN (
            'OPEN',
            'ASSIGNED',
            'IN_PROGRESS',
            'ON_HOLD',
            'ESCALATED',
            'RESOLVED',
            'CLOSED',
            'CANCELLED'
        )
    ),

    CONSTRAINT tickets_sla_status_check
    CHECK (
        sla_status IN (
            'ON_TIME',
            'EXPIRED',
            'BREACHED'
        )
    ),

    CONSTRAINT tickets_escalation_level_check
    CHECK (escalation_level IN (1, 2)),

    CONSTRAINT fk_tickets_requester
    FOREIGN KEY (requester_id)
    REFERENCES users(id)
    ON DELETE RESTRICT,

    CONSTRAINT fk_tickets_agent
    FOREIGN KEY (assigned_agent_id)
    REFERENCES users(id)
    ON DELETE SET NULL,

    CONSTRAINT fk_tickets_category
    FOREIGN KEY (category_id)
    REFERENCES categories(id)
    ON DELETE RESTRICT,

    CONSTRAINT fk_tickets_priority
    FOREIGN KEY (priority_id)
    REFERENCES priorities(id)
    ON DELETE RESTRICT
);

CREATE TABLE ticket_comments (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT NOT NULL,
    user_id BIGINT,
    comment TEXT NOT NULL,
    comment_type VARCHAR(30) NOT NULL DEFAULT 'USER_COMMENT',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT ticket_comments_type_check
    CHECK (comment_type IN ('USER_COMMENT', 'SYSTEM_EVENT')),

    CONSTRAINT ticket_comments_user_required_check
    CHECK (
        comment_type = 'SYSTEM_EVENT'
        OR user_id IS NOT NULL
    ),

    CONSTRAINT fk_ticket_comments_ticket
    FOREIGN KEY (ticket_id)
    REFERENCES tickets(id)
    ON DELETE CASCADE,

    CONSTRAINT fk_ticket_comments_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE SET NULL
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

CREATE INDEX idx_tickets_requester ON tickets(requester_id);
CREATE INDEX idx_tickets_agent ON tickets(assigned_agent_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_sla_status ON tickets(sla_status);
CREATE INDEX idx_tickets_category ON tickets(category_id);
CREATE INDEX idx_tickets_priority ON tickets(priority_id);

CREATE INDEX idx_ticket_comments_ticket ON ticket_comments(ticket_id);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_categories_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_priorities_updated_at
BEFORE UPDATE ON priorities
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_tickets_updated_at
BEFORE UPDATE ON tickets
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE VIEW v_ticket_tracking AS
SELECT
    t.id,
    t.title,
    t.status,
    t.sla_status,
    t.escalation_level,
    t.created_at,
    t.assigned_at,
    t.first_response_due_at,
    t.resolution_due_at,
    t.first_response_at,
    t.resolved_at,
    t.closed_at,
    t.escalated_at,
    c.name AS category_name,
    p.name AS priority_name,
    p.level AS priority_level,
    requester.name AS requester_name,
    agent.name AS assigned_agent_name
FROM tickets t
INNER JOIN categories c ON c.id = t.category_id
INNER JOIN priorities p ON p.id = t.priority_id
INNER JOIN users requester ON requester.id = t.requester_id
LEFT JOIN users agent ON agent.id = t.assigned_agent_id;