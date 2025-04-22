import express from 'express';
import { authenticate } from '../middleware/middleware.js';
import { addUserAccount, fetchUserAccount, fetchUserAccountById, saveBlog, saveNote, unsaveBlog, unsaveNote, updateUserAccount } from '../controllers/accountController.js';

const router = express.Router();

router.post('/account', authenticate,addUserAccount);
router.get('/account', authenticate, fetchUserAccount);
router.get('/account/:userId', fetchUserAccountById);
router.put('/account', authenticate, updateUserAccount);
router.post('/account/:blogId/save',authenticate, saveBlog);
router.delete('/account/:blogId/unsave',authenticate, unsaveBlog);
router.post('/account/:noteId/sa', authenticate, saveNote);
router.delete('/account/:noteId/unsa', authenticate,unsaveNote);


export default router;