import { Router } from 'express';
import verifyToken from '../../../shared/middlewares/auth.middleware.js';
import { addressValidator, deleteAddressValidator } from './address.validator.js';
import addressController from './address.controller.js';

const router = Router();

router.patch('/', verifyToken, addressValidator, addressController.registerAddressController);
router.delete('/:addressId', verifyToken, deleteAddressValidator, addressController.deleteAddressController);

export default router;