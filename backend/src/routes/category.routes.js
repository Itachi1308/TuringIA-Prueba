import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from '../controllers/category.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
const idValidator = param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo.');
const categoryValidators = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('El nombre debe tener entre 2 y 80 caracteres.'),
  body('description').optional().trim().isLength({ max: 240 }).withMessage('La descripción no puede superar 240 caracteres.'),
];

router.get('/', asyncHandler(listCategories));
router.post('/', authenticate, authorize('admin'), categoryValidators, validateRequest, asyncHandler(createCategory));
router.put('/:id', authenticate, authorize('admin'), idValidator, categoryValidators, validateRequest, asyncHandler(updateCategory));
router.delete('/:id', authenticate, authorize('admin'), idValidator, validateRequest, asyncHandler(deleteCategory));

export default router;
