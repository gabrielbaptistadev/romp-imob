import { Router } from 'express';
import verifyToken from '../../shared/middlewares/auth.middleware.js';
import { userUpdateValidator, changePasswordValidator, deleteAccountValidator } from './user.validator.js';
import userController from './user.controller.js';
import addressRoutes from './address/address.routes.js';

const router = Router();

// Perfil
router.get('/me', verifyToken, userController.getProfileController);
router.patch('/me', verifyToken, userUpdateValidator, userController.userUpdateController);

// Segurança
router.patch('/me/password', verifyToken, changePasswordValidator, userController.changePasswordController);

// Deletar conta
router.delete('/me', verifyToken, deleteAccountValidator, userController.deleteAccountController);

// Endereços
router.use('/me/addresses', addressRoutes);

export default router;
