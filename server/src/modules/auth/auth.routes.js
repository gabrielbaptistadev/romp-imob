const router = require('express').Router();
const { registerValidator } = require('./auth.validator');
const authController = require('./auth.controller');

router.post('/register', registerValidator, authController.registerController);

module.exports = router;
