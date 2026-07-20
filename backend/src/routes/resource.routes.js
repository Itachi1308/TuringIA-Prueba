import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createResource,
  deleteResource,
  getResource,
  listResources,
  updateResource,
} from '../controllers/resource.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
const idValidator = param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo.');
const resourceValidators = [
  body('title').trim().isLength({ min: 4, max: 140 }).withMessage('El título debe tener entre 4 y 140 caracteres.'),
  body('description').trim().isLength({ min: 20, max: 1200 }).withMessage('La descripción debe tener entre 20 y 1200 caracteres.'),
  body('level').isIn(['Inicial', 'Intermedio', 'Avanzado']).withMessage('Nivel no válido.'),
  body('durationHours').isInt({ min: 1, max: 1000 }).withMessage('La duración debe estar entre 1 y 1000 horas.'),
  body('imageUrl').trim().isLength({ min: 1, max: 500 }).withMessage('La URL de imagen es obligatoria.'),
  body('categoryId').isInt({ min: 1 }).withMessage('Selecciona una categoría válida.'),
  body('featured').optional().isBoolean().withMessage('El valor destacado debe ser booleano.'),
];

router.get('/', asyncHandler(listResources));
router.get('/:id', idValidator, validateRequest, asyncHandler(getResource));
router.post('/', authenticate, authorize('admin'), resourceValidators, validateRequest, asyncHandler(createResource));
router.put('/:id', authenticate, authorize('admin'), idValidator, resourceValidators, validateRequest, asyncHandler(updateResource));
router.delete('/:id', authenticate, authorize('admin'), idValidator, validateRequest, asyncHandler(deleteResource));

export default router;
