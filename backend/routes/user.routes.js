const express = require('express');
const userController = require('../controllers/user.controller');
const validateUserRegistration = require('../middleware/validateUser.middleware');

const router = express.Router();

router.get('/check', userController.checkUser);
router.post('/register', validateUserRegistration, userController.createUser);
router.post('/login', userController.loginUser);
router.get('/verify-email', userController.verifyEmail);
router.post('/forgot-password', userController.forgotPassword)
router.post('/checkcode', userController.checkCode)

module.exports = router;
