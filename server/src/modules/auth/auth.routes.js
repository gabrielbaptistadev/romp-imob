import { Router } from 'express';
import { registerValidator, loginValidator } from './auth.validator.js';
import authController from './auth.controller.js';
import verifyToken from '../../shared/middlewares/auth.middleware.js';

const router = Router();

// Sistema de autenticação
router.post('/register', registerValidator, authController.registerController);
router.post('/login', loginValidator, authController.loginController);

// Refresh-token JWT
// router.post('/refresh-token', );

// Verificação de e-mail e telefone
router.post('/verify-email', verifyToken);
router.post('/verify-phone', verifyToken);

// router.post('/forgot-password', );
// router.post('/reset-password', );

// Logout
router.post('/logout', verifyToken, authController.logoutController);

export default router;
