const express = require('express');

const UserController = require('../controller/UserContoller');

const router = express.Router();

router.get('/', UserController.getLanding);

module.exports = router;