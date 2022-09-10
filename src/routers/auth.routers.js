import express from 'express';
import { SignIn, SignUp } from '../controllers/auth.controller.js';
import userExistMiddleware from '../middlewares/user.middleware.js';

const router = express.Router();

router.use(userExistMiddleware);

router.post('/sign-up', SignUp);
router.post('/sign-in', SignIn);

export default router;