import express from 'express';
import { getAllCategories, createCategory } from '../controllers/categoryController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Route to get all categories
router.get('/', getAllCategories);

// Route to create a new category
router.post('/', authMiddleware, createCategory);

export default router;