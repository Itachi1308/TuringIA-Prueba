import { validationResult } from 'express-validator';

export const validateRequest = (request, response, next) => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    return response.status(422).json({
      message: 'Los datos enviados no son válidos.',
      errors: errors.array().map(({ path, msg }) => ({ field: path, message: msg })),
    });
  }

  return next();
};
