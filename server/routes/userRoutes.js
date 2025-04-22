import express from 'express';
import { fetchUser, registerUser, userLogin,searchRoute } from '../controllers/userController.js';
import passport from 'passport';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', passport.authenticate('local', {session: 'false'}), userLogin)
router.get('/user/:userId', fetchUser);
router.get('/search', searchRoute);

export default router;