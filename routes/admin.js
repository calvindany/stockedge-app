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

router.post("/transaksi/edit/hapusbarang", AdminController.postHapusBarangdiCart);

router.get("/transaksi/edit/:idtransaksi", AdminController.getEditTransaksi);

router.post("/transaksi/edit/:idtransaksi", AdminController.postEditTransaksi);

router.post("/transaksi/hapus", AdminController.postHapusTransaksi);

router.get("/kategori", AdminController.getKategoriBarang);

router.post("/kategori", AdminController.postKategoriBarang);

router.get("/kategori/:idkategori", AdminController.postEditKategoriBarang);

router.post("/deletekategori", AdminController.postHapusKategoriBarang);

router.get("/karyawan", AdminController.getKaryawan);

router.post("/karyawan/gaji/:idkaryawan", AdminController.postBayarGajiKaryawan);

router.get("/tambahkaryawan", AdminController.getTambahKaryawan);

router.post("/tambahkaryawan", AdminController.postTambahKaryawan);

router.get("/daftarkeuangan", AdminController.getLaporanKeuangan);

router.get("/daftarkeuangan/tambah", AdminController.getTambahDaftarKeuangan);

router.post("/daftarkeuangan/tambah", AdminController.postTambahDatfarKeuangan);

router.get("/daftarkeuangan/edit/:iddaftar", AdminController.getEditDaftarKeuangan);

router.post("/daftarkeuangan/edit/:iddaftar", AdminController.postEditDaftarKeuangan);

router.post("/daftarkeuangan/hapus", AdminController.postHapusDaftarKeuangan);

module.exports = router;
