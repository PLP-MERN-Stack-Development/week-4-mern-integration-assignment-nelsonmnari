import Post from '../models/Post.js';
import User from '../models/User.js';
import { uploadImage } from '../middleware/upload.js';

// Get all posts with optional pagination
export const getAllPosts = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const posts = await Post.find()
      .skip(skip)
      .limit(limit)
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    
    const totalPosts = await Post.countDocuments();
    res.status(200).json({ posts, totalPosts });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
};

// Get a single post by ID or slug
export const getPost = async (req, res) => {
  const { idOrSlug } = req.params;

  try {
    const post = await Post.findOne({ $or: [{ _id: idOrSlug }, { slug: idOrSlug }] })
      .populate('author', 'username');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error });
  }
};

// Create a new post
export const createPost = async (req, res) => {
  const { title, content, category } = req.body;
  const author = req.user.id; // Assuming user is authenticated and user ID is available in req.user

  try {
    const newPost = new Post({ title, content, category, author });
    
    if (req.file) {
      const imageUrl = await uploadImage(req.file);
      newPost.image = imageUrl;
    }

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
};

// Update an existing post
export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content, category } = req.body;

  try {
    const updatedPost = await Post.findByIdAndUpdate(id, { title, content, category }, { new: true });
    
    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPost = await Post.findByIdAndDelete(id);
    
    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error });
  }
};

// Add a comment to a post
export const addComment = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const author = req.user.id;

  try {
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({ content, author });
    await post.save();
    
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error });
  }
};

// Search posts
export const searchPosts = async (req, res) => {
  const { query } = req.query;

  try {
    const posts = await Post.find({ title: { $regex: query, $options: 'i' } })
      .populate('author', 'username');
    
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error searching posts', error });
  }
};