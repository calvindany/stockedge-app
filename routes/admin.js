const express = require("express");
const AdminController = require("../controller/AdminController");
const router = express.Router();

router.get("/dashboard", AdminController.getDashboard);

router.get("/barang", AdminController.getBarang);

router.post("/barang", AdminController.postBarang);

router.post("/barang/:idbarang", AdminController.postEditBarang);

router.post("/deletebarang", AdminController.postDeleteBarang);

router.get('/transaksi', AdminController.getTransaksi);

router.get("/transaksi/tambah", AdminController.getTambahTransaksi);

router.post("/transaksi/tambah", AdminController.postTambahTransaksi);

router.get("/transaksi/edittransaksi/:idtransaksi", AdminController.getEditTransaksi);

router.post("/transaksi/edittransaksi/:idtransaksi", AdminController.postEditTransaksi);

module.exports = router;
