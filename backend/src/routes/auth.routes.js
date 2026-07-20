import { Router } from 'express';
import { body } from 'express-validator';
import { login, me, refresh } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Ingresa un correo válido.'),
    body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres.'),
  ],
  validateRequest,
  asyncHandler(login),
);

router.post(
  '/refresh',
  [body('refreshToken').isString().notEmpty().withMessage('El refresh token es obligatorio.')],
  validateRequest,
  asyncHandler(refresh),
);

router.get('/me', authenticate, asyncHandler(me));

export default router;
