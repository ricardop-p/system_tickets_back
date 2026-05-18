import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: "No hay token, acceso denegado" });

    jwt.verify(token, process.env.JWT_SECRET || 'firma_secreta', (err, user) => {
        if (err) return res.status(403).json({ message: "Token inválido o expirado" });
        req.user = user; 
        next();
    });
};