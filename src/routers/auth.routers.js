import express from 'express';
import { SignIn, SignUp } from '../controllers/auth.controller.js';
import { loginSchemaMiddleware,userSchemaMiddleware } from '../middlewares/schemas.middleware.js';
import userExistMiddleware from '../middlewares/user.middleware.js';

const router = express.Router();

router.use(userExistMiddleware);

router.post('/sign-up', userSchemaMiddleware, SignUp);
router.post('/sign-in', loginSchemaMiddleware, SignIn);

export default router;