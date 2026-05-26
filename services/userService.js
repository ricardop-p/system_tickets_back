import bcrypt from 'bcryptjs';
import { createHttpError } from '../utils/httpError.js';
import {
  findAllUsers,
  findUserByEmail,
  createUser as createUserRepository,
} from '../repositories/authRepository.js';

const getUserRole = (user) => String(user?.role || user?.rol || '').toUpperCase();

const ensureAdmin = (user) => {
  if (getUserRole(user) !== 'ADMIN') {
    throw createHttpError(403, 'Solo un administrador puede ver o crear usuarios');
  }
};

const allowedRoles = ['ADMIN', 'AGENT', 'USER'];

export const listUsers = async (user) => {
  ensureAdmin(user);
  return findAllUsers();
};

export const createUser = async (user, payload) => {
  ensureAdmin(user);

  const { name, email, password, role, is_active = true, age} = payload;

  if (!name) {
    throw createHttpError(400, 'El nombre es obligatorio');
  }

  if (!email) {
    throw createHttpError(400, 'El email es obligatorio');
  }

  if (!password) {
    throw createHttpError(400, 'La contraseña es obligatoria');
  }

  if (!role) {
    throw createHttpError(400, 'El rol es obligatorio');
  }

  const normalizedRole = String(role).toUpperCase();

  if (!allowedRoles.includes(normalizedRole)) {
    throw createHttpError(400, `Rol invalido. Los roles permitidos son: ${allowedRoles.join(', ')}`);
  }

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw createHttpError(400, 'Ya existe un usuario con ese email');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  return createUserRepository({
    name,
    email,
    passwordHash,
    role: normalizedRole,
    isActive: Boolean(is_active),
    age: age ? Number(age) : null,
  });
};
