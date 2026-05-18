import pool from '../db.js';

export const getTickets = async (req, res) => {
    const { id, rol } = req.user;
    try {
        let result;
        if (rol === 'usuario') {
            result = await pool.query(
                'SELECT * FROM tickets WHERE usuario_id = $1 ORDER BY fecha_creacion DESC', 
                [id]
            );
        } else {
            result = await pool.query('SELECT * FROM tickets ORDER BY prioridad DESC, fecha_creacion DESC');
        }
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener los tickets" });
    }
};

export const getTicketById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM tickets WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: "Ticket no encontrado" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener el detalle" });
    }
};

export const createTicket = async (req, res) => {
    const { titulo, descripcion, prioridad } = req.body;
    const usuario_id = req.user.id; 
    try {
        const query = `
            INSERT INTO tickets (titulo, descripcion, prioridad, estado, usuario_id, nivel_escalado, fecha_limite) 
            VALUES ($1, $2, $3, 'Abierto', $4, 1, NOW() + INTERVAL '24 hours') 
            RETURNING *`;
        const result = await pool.query(query, [titulo, descripcion, prioridad, usuario_id]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};