import { Router } from 'express';
import { registerValidator, loginValidator } from './auth.validator.js';
import authController from './auth.controller.js';
import verifyToken from '../../shared/middlewares/auth.middleware.js';

const router = Router();

router.post('/register', registerValidator, authController.registerController);
router.post('/login', loginValidator, authController.loginController);

// router.post('/refresh-token', );

router.post('/verify-email', verifyToken);
router.post('/verify-phone', verifyToken);

// router.post('/forgot-password', );
// router.post('/reset-password', );

// router.post('/logout', );


export default router;
