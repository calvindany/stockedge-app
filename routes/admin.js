const express = require("express");
const AdminController = require("../controller/AdminController");
const router = express.Router();

router.get("/dashboard", AdminController.getDashboard);

router.get("/barang", AdminController.getBarang);

router.post("/barang", AdminController.postBarang);

router.post("/barang/:idbarang", AdminController.postEditBarang);

router.post("/deletebarang", AdminController.postDeleteBarang);

router.get("/transaksi", AdminController.getTransaksi);

router.get("/transaksi/tambah", AdminController.getTambahTransaksi);

router.post("/transaksi/tambah", AdminController.postTambahTransaksi);

router.post(
  "/transaksi/edit/hapusbarang",
  AdminController.postHapusBarangdiCart
);

router.get("/transaksi/edit/:idtransaksi", AdminController.getEditTransaksi);

router.post("/transaksi/edit/:idtransaksi", AdminController.postEditTransaksi);

router.post("/transaksi/hapus", AdminController.postHapusTransaksi);

module.exports = router;
