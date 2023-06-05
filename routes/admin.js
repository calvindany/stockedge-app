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

router.post("/transaksi/bayar", AdminController.postBayarOrderMasuk);

router.post("/transaksi/hapus", AdminController.postHapusTransaksi);

router.get("/transaksi/masukbarang", AdminController.getMasukBarang);

router.get("/transaksi/masukbarang/tambah", AdminController.getTambahMasukBarang);

router.post("/transaksi/masukbarang/tambah", AdminController.postTambahMasukBarang);

router.post("/transaksi/masukbarang/edit/hapusbarang", AdminController.postHapusBarangdiCartMasukBarang);

router.get("/transaksi/masukbarang/edit/:idbarangmasuk", AdminController.getEditMasukBarang);

router.post("/transaksi/masukbarang/edit/:idbarangmasuk", AdminController.postEditMasukBarang);

router.post("/transaksi/masukbarang/bayar", AdminController.postBayarMasukBarang);

router.post("/transaksi/masukbarang/hapus", AdminController.postHapusMasukBarang);

router.get("/kategori", AdminController.getKategoriBarang);

router.post("/kategori/tambah", AdminController.postTambahKategoriBarang);

router.post("/kategori/edit/:idkategori", AdminController.postEditKategoriBarang);

router.post("/deletekategori", AdminController.postHapusKategoriBarang);

router.get("/karyawan", AdminController.getKaryawan);

router.get("/karyawan/tambah", AdminController.getTambahKaryawan);

router.post("/karyawan/tambah", AdminController.postTambahKaryawan);

router.get("/karyawan/edit/:idkaryawan", AdminController.getEditKaryawan);

router.post("/karyawan/edit/:idkaryawan", AdminController.postEditKaryawan);

router.post("/karyawan/gaji/:idkaryawan", AdminController.postBayarGajiKaryawan);

router.get("/daftarkeuangan", AdminController.getLaporanKeuangan);

router.get("/daftarkeuangan/tambah", AdminController.getTambahDaftarKeuangan);

router.post("/daftarkeuangan/tambah", AdminController.postTambahDatfarKeuangan);

router.get("/daftarkeuangan/edit/:iddaftar", AdminController.getEditDaftarKeuangan);

router.post("/daftarkeuangan/edit/:iddaftar", AdminController.postEditDaftarKeuangan);

router.post("/daftarkeuangan/hapus", AdminController.postHapusDaftarKeuangan);
 
module.exports = router;
