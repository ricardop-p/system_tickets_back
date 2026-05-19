import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import { findUserByEmail } from '../repositories/userRepository.js';
import { createHttpError } from '../utils/httpError.js';

const isBcryptHash = (password) => (
  password?.startsWith('$2a$') || password?.startsWith('$2b$') || password?.startsWith('$2y$')
);

const validatePassword = async (plainPassword, storedPassword) => {
  if (!storedPassword) return false;
  if (isBcryptHash(storedPassword)) return bcrypt.compare(plainPassword, storedPassword);
  return plainPassword === storedPassword;
};

export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw createHttpError(400, 'Email y password son obligatorios');
  }

  const usuario = await findUserByEmail(email);

  if (!usuario) {
    throw createHttpError(401, 'Usuario no encontrado');
  }

  const isValidPassword = await validatePassword(password, usuario.password);

  if (!isValidPassword) {
    throw createHttpError(401, 'Contrasena incorrecta');
  }

  const token = jwt.sign(
    { id: usuario.id, rol: usuario.rol },
    env.jwtSecret,
    { expiresIn: '2h' }
  );

  return {
    token,
    user: {
      nombre: usuario.nombre,
      rol: usuario.rol,
    },
  };
};
