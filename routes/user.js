const express = require('express');

const UserController = require('../controller/UserContoller');

const router = express.Router();

router.get('/', UserController.getLanding);

router.get('/produk', UserController.getProduk);

router.get('/keranjang', UserController.getKeranjang);

module.exports = router;