import pool from '../db.js';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(401).json({ message: "Usuario no encontrado" });

        const usuario = result.rows[0];
        if (usuario.password !== password) return res.status(401).json({ message: "Contraseña incorrecta" });

        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol }, 
            process.env.JWT_SECRET || 'firma_secreta', 
            { expiresIn: '2h' }
        );

        res.json({ token, user: { nombre: usuario.nombre, rol: usuario.rol } });
    } catch (err) {
        res.status(500).json({ message: "Error en el servidor" });
    }
};