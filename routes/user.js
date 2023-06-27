const express = require('express');

const UserController = require('../controller/UserContoller');
const AuthCheck = require('../util/auth');

const router = express.Router();

router.get('/', AuthCheck.authCheck, UserController.getLanding);

router.get('/produk', AuthCheck.authCheck, UserController.getProduk);

router.post('/produk/tambah', AuthCheck.authCheck, UserController.postTambahProdukKeKeranjang);

router.get('/keranjang', AuthCheck.authCheck, UserController.getKeranjang);

router.post('/keranjang/edit', AuthCheck.authCheck, UserController.postEditStokDalamKeranjang);

router.post('/keranjang/hapus', AuthCheck.authCheck, UserController.postHapusStokDalamKeranjang);

router.post('/keranjang/pesan', AuthCheck.authCheck, UserController.postPesanBarangDalamKeranjang);

module.exports = router;