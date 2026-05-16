import { Router } from 'express';
import verifyToken from '../../shared/middlewares/auth.middleware.js';
import { userUpdateValidator, changePasswordValidator, deleteAccountValidator, addressValidator } from './user.validator.js';
import userController from './user.controller.js';

const router = Router();

// Perfil
router.get('/me', verifyToken, userController.getProfileController);
router.patch('/me', verifyToken, userUpdateValidator, userController.userUpdateController);

// Endereços
router.patch('/me/addresses', verifyToken, addressValidator, userController.registerAddressController);

// Segurança
router.patch('/me/password', verifyToken, changePasswordValidator, userController.changePasswordController);

// Deletar conta
router.delete('/me', verifyToken, deleteAccountValidator, userController.deleteAccountController);

export default router;
