import express from 'express';
import { addBlog, deleteBlog, getBlogById, getBlogs, updateBlog, addBlogComment, deleteBlogComment } from '../controllers/blogController.js';
import { authenticate } from '../middleware/middleware.js';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post('/', authenticate,upload.single('image'),addBlog);
router.get('/', getBlogs)
router.get('/:blogId', getBlogById);
router.put('/:blogId/edit', authenticate,upload.single('image'), updateBlog);
router.delete('/:blogId', authenticate,deleteBlog);
router.post('/:blogId/comments', authenticate, addBlogComment)
router.delete('/:blogId/comments/:commentId', authenticate, deleteBlogComment)

export default router;