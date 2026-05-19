export const notFoundHandler = (req, res) => {
  return res.status(404).json({
    message: 'Ruta no encontrada',
  });
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  console.error(err.message);

  return res.status(statusCode).json({
    message: err.message || 'Error interno del servidor',
  });
};
