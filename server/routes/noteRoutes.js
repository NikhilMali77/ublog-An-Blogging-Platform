import express from 'express';
import { addComment, addCommentReply, addNote, deleteComment, deleteNote, deleteReply, getNoteById, getNotes, likeComment, likeNote } from '../controllers/noteController.js'
import { authenticate } from '../middleware/middleware.js';

const router = express.Router();

router.post('/',authenticate, addNote);
router.get('/', getNotes)
router.get('/:noteId', getNoteById)
router.delete('/:noteId',authenticate, deleteNote)
router.post('/:noteId', authenticate, addComment)
router.post('/:noteId/comments/:commentId',authenticate, addCommentReply);
router.patch('/:noteId/like', authenticate, likeNote)
router.patch('/:noteId/:commentId/like', authenticate, likeComment)
router.delete('/:noteId/comments/:commentId', deleteComment)
router.delete('/:noteId/comments/:commentId/replies/:replyId', deleteReply)

export default router;