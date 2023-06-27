const express = require('express');

const UserController = require('../controller/UserContoller');

const router = express.Router();

router.get('/', UserController.getLanding);

router.get('/produk', UserController.getProduk);

router.post('/produk/tambah', UserController.postTambahProdukKeKeranjang);

router.get('/keranjang', UserController.getKeranjang);

router.post('/keranjang/hapus', UserController.postEditStokDalamKeranjang);

module.exports = router;