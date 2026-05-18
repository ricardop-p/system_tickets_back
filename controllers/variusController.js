import pool from '../db.js';
import jwt from 'jsonwebtoken';

export const getPriority = async (req, res) => {

    try {
        res.status(200).json({
            prioritys: [
                { id: 1, name: 'Alta' },
                { id: 2, name: 'Media' },
                { id: 3, name: 'Baja' }

            ]
        });
        
    } catch (err) {
        res.status(500).json({ message: "Error en el servidor" });
    }

};

export const getSeniority = (req, res) => {
  const { years } = req.query;

  const age = Number(years);

  if (!years || Number.isNaN(age)) {
    return res.status(400).json({
      message: 'Debe enviar una edad válida'
    });
  }

  return res.json({
    years: age,
    isAdult: age >= 18,
    message: age >= 18 ? 'Es mayor de edad' : 'Es menor de edad'
  });
};