const express = require('express');

const UserController = require('../controller/UserContoller');
const AuthCheck = require('../util/auth');
const ImgUpload = require("../util/imgUpload");

const router = express.Router();

router.get('/', AuthCheck.authCheckPublic, UserController.getLanding);

router.get('/produk', AuthCheck.authCheckPublic, UserController.getProduk);

router.post('/produk/tambah', AuthCheck.authCheckUser, UserController.postTambahProdukKeKeranjang);

router.get('/keranjang', AuthCheck.authCheckUser, UserController.getKeranjang);

router.post('/keranjang/edit', AuthCheck.authCheckUser, UserController.postEditStokDalamKeranjang);

router.post('/keranjang/hapus', AuthCheck.authCheckUser, UserController.postHapusStokDalamKeranjang);

router.post('/keranjang/pesan', AuthCheck.authCheckUser, UserController.postPesanBarangDalamKeranjang);

router.get('/invoice', AuthCheck.authCheckUser, UserController.getInvoice);

router.post('/invoice/buktibayar/tambah', AuthCheck.authCheckUser, ImgUpload.uploadToGcsInvoiceAsset, UserController.postBuktiPembayaran);

module.exports = router;