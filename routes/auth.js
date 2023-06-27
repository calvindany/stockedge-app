const express = require('express');
const AuthController = require('../controller/AuthController');

const router = express.Router();

router.get('/login', AuthController.getLogin);

router.post('/login', AuthController.postLogin);

router.get('/registrasi', AuthController.getRegister);

router.post('/registrasi', AuthController.postRegister);

router.post('/logout', AuthController.postLogout);

module.exports = router;