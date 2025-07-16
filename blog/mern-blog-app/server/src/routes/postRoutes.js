import express from 'express';
import {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  addComment,
  searchPosts,
} from '../controllers/postController.js';
import { authenticate } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Get all posts with optional pagination and filters
router.get('/', getAllPosts);

// Get a single post by ID or slug
router.get('/:idOrSlug', getPost);

// Create a new post
router.post('/', authenticate, upload.single('image'), createPost);

// Update an existing post
router.put('/:id', authenticate, upload.single('image'), updatePost);

// Delete a post
router.delete('/:id', authenticate, deletePost);

// Add a comment to a post
router.post('/:postId/comments', authenticate, addComment);

// Search posts
router.get('/search', searchPosts);

export default router;