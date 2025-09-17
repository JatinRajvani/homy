const express = require('express');
const { register, login, logout, socialLogin } = require('./authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/social-login', socialLogin);

module.exports = router;
