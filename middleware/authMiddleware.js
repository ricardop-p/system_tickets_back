import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No hay token, acceso denegado' });
  }

  jwt.verify(token, env.jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token invalido o expirado' });
    }

    req.user = user;
    return next();
  });
};
