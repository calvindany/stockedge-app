const express = require('express');

const UserController = require('../controller/UserContoller');

const router = express.Router();

router.get('/', UserController.getLanding);

router.get('/produk', UserController.getProduk);

router.post('/produk/tambah', UserController.postTambahProdukKeKeranjang);

router.get('/keranjang', UserController.getKeranjang);

router.post('/keranjang/edit', UserController.postEditStokDalamKeranjang);

router.post('/keranjang/hapus', UserController.postHapusStokDalamKeranjang);

router.post('/keranjang/pesan', UserController.postPesanBarangDalamKeranjang);

module.exports = router;