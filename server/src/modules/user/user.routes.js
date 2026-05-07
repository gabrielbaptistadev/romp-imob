import { Router } from 'express';
import verifyToken from '../../shared/middlewares/auth.middleware.js';
import { userUpdateValidator, changePasswordValidator } from './user.validator.js';
import userController from './user.controller.js';

const router = Router();

// Perfil
router.get('/me', verifyToken, userController.getProfileController);
router.patch('/me', verifyToken, userUpdateValidator, userController.userUpdateController);

// Endereços
router.put('/me/addresses', verifyToken, );

// Segurança
router.patch('/me/password', verifyToken, changePasswordValidator);

// Deletar conta
router.delete('/me', verifyToken, );

export default router;
