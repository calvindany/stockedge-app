const express = require("express");

const AdminController = require("../controller/AdminController");

const AuthCheck = require("../util/auth");
const ImgUpload = require("../util/imgUpload");

const router = express.Router();

router.get("/dashboard", AuthCheck.authCheckAdmin,  AdminController.getDashboard);

router.get("/barang", AuthCheck.authCheckAdmin, AdminController.getBarang);

router.post("/barang", AuthCheck.authCheckAdmin, ImgUpload.uploadToGcsWebAsset, AdminController.postBarang);

router.post("/barang/:idbarang", AuthCheck.authCheckAdmin, ImgUpload.editToGcsWebAsset, AdminController.postEditBarang);

router.post("/deletebarang", AuthCheck.authCheckAdmin, ImgUpload.deleteToGcsWebAsset, AdminController.postDeleteBarang);

router.get("/transaksi", AuthCheck.authCheckAdmin, AdminController.getTransaksi);

router.get("/transaksi/tambah", AuthCheck.authCheckAdmin, AdminController.getTambahTransaksi);

router.post("/transaksi/tambah", AuthCheck.authCheckAdmin, AdminController.postTambahTransaksi);

router.post("/transaksi/edit/hapusbarang", AuthCheck.authCheckAdmin, AdminController.postHapusBarangdiCart);

router.get("/transaksi/edit/:idtransaksi", AuthCheck.authCheckAdmin, AdminController.getEditTransaksi);

router.post("/transaksi/edit/:idtransaksi", AuthCheck.authCheckAdmin, AdminController.postEditTransaksi);

router.post("/transaksi/bayar", AuthCheck.authCheckAdmin, AdminController.postLunasOrderMasuk);

router.post("/transaksi/hapus", AuthCheck.authCheckAdmin, AdminController.postHapusTransaksi);

router.get("/transaksi/masukbarang", AuthCheck.authCheckAdmin, AdminController.getMasukBarang);

router.get("/transaksi/masukbarang/tambah", AuthCheck.authCheckAdmin, AdminController.getTambahMasukBarang);

router.post("/transaksi/masukbarang/tambah", AuthCheck.authCheckAdmin, AdminController.postTambahMasukBarang);

router.post("/transaksi/masukbarang/edit/hapusbarang", AuthCheck.authCheckAdmin, AdminController.postHapusBarangdiCartMasukBarang);

router.get("/transaksi/masukbarang/edit/:idbarangmasuk", AuthCheck.authCheckAdmin, AdminController.getEditMasukBarang);

router.post("/transaksi/masukbarang/edit/:idbarangmasuk", AuthCheck.authCheckAdmin, AdminController.postEditMasukBarang);

router.post("/transaksi/masukbarang/bayar", AuthCheck.authCheckAdmin, AdminController.postBayarMasukBarang);

router.post("/transaksi/masukbarang/hapus", AuthCheck.authCheckAdmin, AdminController.postHapusMasukBarang);

router.get("/kategori", AuthCheck.authCheckAdmin, AdminController.getKategoriBarang);

router.post("/kategori/tambah", AuthCheck.authCheckAdmin, ImgUpload.uploadToGcsWebAsset, AdminController.postTambahKategoriBarang);

router.post("/kategori/edit/:idkategori", AuthCheck.authCheckAdmin, ImgUpload.editToGcsWebAsset, AdminController.postEditKategoriBarang);

router.post("/kategori/delete", AuthCheck.authCheckAdmin, ImgUpload.deleteToGcsWebAsset, AdminController.postHapusKategoriBarang);

router.get("/karyawan", AuthCheck.authCheckAdmin, AdminController.getKaryawan);

router.get("/karyawan/tambah", AuthCheck.authCheckAdmin, AdminController.getTambahKaryawan);

router.post("/karyawan/tambah", AuthCheck.authCheckAdmin, AdminController.postTambahKaryawan);

router.get("/karyawan/edit/:idkaryawan", AuthCheck.authCheckAdmin, AdminController.getEditKaryawan);

router.post("/karyawan/edit/:idkaryawan", AuthCheck.authCheckAdmin, AdminController.postEditKaryawan);

router.post("/karyawan/gaji/:idkaryawan", AuthCheck.authCheckAdmin, AdminController.postBayarGajiKaryawan);

router.get("/daftarkeuangan", AuthCheck.authCheckAdmin, AdminController.getLaporanKeuangan);

router.get("/daftarkeuangan/tambah", AuthCheck.authCheckAdmin, AdminController.getTambahDaftarKeuangan);

router.post("/daftarkeuangan/tambah", AuthCheck.authCheckAdmin, AdminController.postTambahDatfarKeuangan);

router.get("/daftarkeuangan/edit/:iddaftar", AuthCheck.authCheckAdmin, AdminController.getEditDaftarKeuangan);

router.post("/daftarkeuangan/edit/:iddaftar", AuthCheck.authCheckAdmin, AdminController.postEditDaftarKeuangan);

router.post("/daftarkeuangan/hapus", AuthCheck.authCheckAdmin, AdminController.postHapusDaftarKeuangan);
 
module.exports = router;
