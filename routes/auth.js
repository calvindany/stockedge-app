const express = require('express');
const AuthController = require('../controller/AuthController');

const router = express.Router();

router.get('/login', AuthController.getLogin);

router.post('/login', AuthController.postLogin);

module.exports = router;