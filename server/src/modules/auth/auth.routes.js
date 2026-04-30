const router = require('express').Router();
const {
    registerMiddleware,
    loginMiddleware
} = require('./auth.validator');
const authController = require('./auth.controller');

router.post('/register', registerMiddleware, authController.register);
router.post('/login', loginMiddleware, authController.login)

module.exports = router;
