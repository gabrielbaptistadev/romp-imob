const router = require('express').Router();
const { registerValidator, loginValidator } = require('./auth.validator');
const authController = require('./auth.controller');

router.post('/register', registerValidator, authController.registerController);
router.post('/login', loginValidator, authController.loginController);

module.exports = router;
