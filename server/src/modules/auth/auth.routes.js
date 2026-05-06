import { Router } from 'express';
import { registerValidator, loginValidator } from './auth.validator.js';
import verifyToken from '../../shared/middlewares/auth.middleware.js';
import authController from './auth.controller.js';

const router = Router();

router.post('/register', registerValidator, authController.registerController);
router.post('/login', loginValidator, authController.loginController);

export default router;
