export const notFound = (request, response) => {
  response.status(404).json({ message: `Ruta no encontrada: ${request.method} ${request.originalUrl}` });
};

export const errorHandler = (error, request, response, next) => {
  void next;
  console.error(error);

  if (error.code === '23505') {
    return response.status(409).json({ message: 'Ya existe un registro con esos datos.' });
  }

  if (error.code === '23503') {
    return response.status(409).json({
      message: 'El registro está relacionado con otros datos y no puede eliminarse.',
    });
  }

  const status = error.status || 500;
  const message = status === 500 ? 'Ocurrió un error interno en el servidor.' : error.message;

  return response.status(status).json({ message });
};
