import { createHttpError } from '../utils/httpError.js';

export const getPriorities = () => ({
  prioritys: [
    { id: 1, name: 'Alta' },
    { id: 2, name: 'Media' },
    { id: 3, name: 'Baja' },
  ],
});

export const checkSeniority = (years) => {
  const age = Number(years);

  if (!years || Number.isNaN(age)) {
    throw createHttpError(400, 'Debe enviar una edad valida');
  }

  return {
    years: age,
    isAdult: age >= 18,
    message: age >= 18 ? 'Es mayor de edad' : 'Es menor de edad',
  };
};
