const fs = require("fs");
const path = require("path");
const Barang = require("../model/barang");
const Transaksi = require("../model/transaction");
const Kategori = require("../model/kategori");
const Karyawan = require("../model/karyawan");
const Keuangan = require("../model/keuangan");
const RiwayatKeuangan = require("../model/riwayatKeuangan");
const BarangMasuk = require("../model/barangmasuk");

const fileHelper = require("../util/fileDelete");
const sharp = require("sharp");

exports.getDashboard = (req, res, next) => {
  const date = new Date();
  let keuntunganHarian = {};
  let keluaranHarian = {};

  Transaksi.find()
    .limit(5)
    .then((transaksi) => {
      RiwayatKeuangan.findOne({ tahun: "2023" }).then((riwayat) => {
        // console.log(riwayat.getKeuntunganHariIni())
        riwayat
          .getKeuntunganHariIni(date)
          .then((keuntungan) => {
            keuntunganHarian = keuntungan;
            return riwayat.getKeluaranHariIni(date);
          })
          .then((keluaran) => {
            return (keluaranHarian = keluaran);
          })
          .then((result) => {
            return res.render("admin/dashboard/dashboard2", {
              route: "/dashboard",
              transaksi: transaksi,
              keuntunganHarian: keuntunganHarian,
              keluaranHarian: keluaranHarian,
              riwayatKeuangan: riwayat,
            });
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getBarang = (req, res, next) => {
  let messageSuccess = req.flash("success");
  let messageError = req.flash("error");
  let message = [];

  if (messageSuccess.length > 0) {
    (message[0] = "success"), (message[1] = messageSuccess[0]);
  } else if (messageError.length > 0) {
    (message[0] = "error"), (message[1] = messageError[0]);
  } else {
    message = null;
  }

  Kategori.find()
    .then((kategori) => {
      Barang.find()
        .then((barang) => {
          res.render("admin/barang/barang", {
            title: "Inventaris Barang",
            route: "/barang",
            barang: barang,
            kategori: kategori,
            message: message,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.postBarang = (req, res, next) => {
  const namabarang = req.body.namabarang;
  const kategori = req.body.kategori;
  const stok = req.body.stok;
  const harga = req.body.harga;
  const modal = req.body.modal;

  const newbarang = new Barang({
    namabarang: namabarang,
    kategori: kategori,
    stok: stok,
    harga: harga,
    modal: modal,
  });

  if (req.file && !req.file.cloudStorageError) {
    newbarang.image = req.file.cloudStoragePublicUrl;
  }

  req.flash("success", "Barang berhasil disimpan");
  newbarang.save();
  return res.redirect("/barang");
};

exports.postEditBarang = (req, res, next) => {
  const idupdatedbarang = req.body.idupdatedbarang;
  const newnamabarang = req.body.namabarang;
  const newstok = req.body.stok;
  const newharga = req.body.harga;
  const newmodal = req.body.modal;

  Barang.findOne({ _id: idupdatedbarang })
    .then((barang) => {
      barang.namabarang = newnamabarang;
      barang.stok = newstok;
      barang.harga = newharga;
      barang.modal = newmodal;

      if (req.file && !req.file.cloudStorageError) {
        barang.image = req.file.cloudStoragePublicUrl;
      } else {
        barang.image = barang.image;
      }

      barang.save();
      req.flash("success", "Barang berhasil diedit");

      return res.redirect("/barang");
    })
    .catch((err) => {
      console.log(err);
      req.flash("error", "Ada yang salah, silahkan hubungi developer");
      return res.redirect("/barang");
    });
};

exports.postDeleteBarang = (req, res, next) => {
  const idbarang = req.body.idbarangfordeleted;
  Barang.findOne({ _id: idbarang })
    .then((barang) => {
      // console.log(req.succesDelete)
      if (!req.succesDelete) {
        console.log("Gagal menghapus foto");
      }
      return Barang.findOneAndDelete({ _id: idbarang });
    })
    .then((result) => {
      req.flash("success", "Barang berhasil dihapus");
      return res.redirect("/barang");
    })
    .catch((err) => {
      req.flash("error", "Ada yang salah, silahkan hubungi developer");
      console.log(err);
      return res.redirect("/barang");
    });
};

exports.getTransaksi = (req, res, next) => {
  let messageSuccess = req.flash("success");
  let messageError = req.flash("error");
  let message = [];

  if (messageSuccess.length > 0) {
    (message[0] = "success"), (message[1] = messageSuccess[0]);
  } else if (messageError.length > 0) {
    (message[0] = "error"), (message[1] = messageError[0]);
  } else {
    message = null;
  }

  Transaksi.find()
    .sort({ createdAt: -1 })
    .then((transaksi) => {
      res.render("admin/transaksi/transaksi", {
        route: "/transaksi",
        transaksi: transaksi,
        message: message,
      });
    })
    .catch((err) => console.log(err));
};

exports.getTambahTransaksi = (req, res, next) => {
  let messageSuccess = req.flash("success");
  let messageError = req.flash("error");
  let message = [];

  if (messageSuccess.length > 0) {
    (message[0] = "success"), (message[1] = messageSuccess[0]);
  } else if (messageError.length > 0) {
    (message[0] = "error"), (message[1] = messageError[0]);
  } else {
    message = null;
  }

  Barang.find().then((barang) => {
    res.render("admin/transaksi/tambahtransaksi", {
      route: "/transaksi/tambah",
      barang: barang,
      transaksi: null,
      message: message,
    });
  });
};

exports.postTambahTransaksi = (req, res, next) => {
  const namapembeli = req.body.namapembeli;
  const tanggal = req.body.tanggal;
  const status = req.body.status == "null" ? "Draft" : req.body.status;
  const idbarangpilihan = req.body.idbarang;
  const namabarang = req.body.namabarang;
  const jumlah = req.body.jumlah;
  const harga = req.body.hargavalue;

  const transaksibaru = new Transaksi({
    namapembeli: namapembeli,
    tanggal: tanggal,
    status: status,
  });

  transaksibaru
    .tambahBarang({ idbarangpilihan, namabarang, jumlah, harga })
    .then((result) => {
      Barang.findOne({ _id: idbarangpilihan })
        .then((barang) => {
          barang.stok -= jumlah;

          barang.save();
        })
        .catch((err) => console.log(err));

      return transaksibaru.hitungKeuntungan();
    })
    .then((result) => {
      req.flash("success", "Berhasil menambahkan barang");
      return res.redirect("/transaksi/edit/" + transaksibaru._id);
    })
    .catch((err) => {
      req.flash("error", "Ada yang salah, silahkan hubungi developer");
      // console.log(err);
      return res.redirect("/transaksi/tambah");
    });
};

exports.getEditTransaksi = (req, res, next) => {
  let messageSuccess = req.flash("success");
  let messageError = req.flash("error");
  let message = [];

  if (messageSuccess.length > 0) {
    (message[0] = "success"), (message[1] = messageSuccess[0]);
  } else if (messageError.length > 0) {
    (message[0] = "error"), (message[1] = messageError[0]);
  } else {
    message = null;
  }

  const idtransaksi = req.params.idtransaksi;
  Transaksi.findOne({ _id: idtransaksi }).then((transaksi) => {
    Barang.find().then((barang) => {
      res.render("admin/transaksi/tambahtransaksi", {
        route: "/transaksi",
        transaksi: transaksi,
        barang: barang,
        message: message,
      });
    });
  });
};

exports.postEditTransaksi = (req, res, next) => {
  const idtransaksi = req.params.idtransaksi;

  const namapembeli = req.body.namapembeli;
  const tanggal = req.body.tanggal;
  const idbarangpilihan = req.body.idbarang;
  const jumlah = req.body.jumlah;
  const harga = req.body.hargavalue;

  if (!namapembeli || !tanggal || !idbarangpilihan || !jumlah || !harga) {
    req.flash("error", "Silahkan pilih dahulu barangnya baru tambah");
    return res.redirect("/transaksi/edit/" + idtransaksi);
  }

  // Transaksi.findOne({ _id: idtransaksi })
  //   .then((transaksi) => {
  //     transaksi.namapembeli = namapembeli;
  //     transaksi.tanggal = tanggal;
  //     transaksi.tambahBarang({ idbarangpilihan, jumlah, harga }).then(() => {
  //       Barang.findOne({ _id: idbarangpilihan })
  //         .then((barang) => {
  //           barang.stok -= jumlah;
  //           barang.save();
  //         })
  //         .catch((err) => console.log(err));
  //       return transaksi.hitungKeuntungan();
  //     });
  //   })
  //   .then(() => {
  //     req.flash("success", "Berhasil menambahkan barang");
  //     return res.redirect("/transaksi/edit/" + idtransaksi);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     req.flash("error", "Ada yang salah, silahkan hubungi developer");
  //     return res.redirect("/transaksi/edit/" + idtransaksi);
  //   });
};

exports.postHapusBarangdiCart = (req, res, next) => {
  const idbarang = req.body.idbarang;
  const idtransaksi = req.body.idtransaksi;

  Transaksi.findOne({ _id: idtransaksi })
    .then((transaksi) => {
      return transaksi.hapusBarang(idbarang);
    })
    .then((result) => {
      req.flash("success", "Berhasil menghapus barang");
      return res.redirect("/transaksi/edit/" + idtransaksi);
    })
    .catch((err) => {
      req.flash("error", "Ada yang salah, silahkan hubungi developer");
      // console.log(err)
      return res.redirect("/transaksi/edit/" + idtransaksi);
    });
};

exports.postLunasOrderMasuk = (req, res, next) => {
  const idtransaksi = req.body.idtransaksi;
  Transaksi.findOne({ _id: idtransaksi })
    .then((transaksi) => {
      transaksi.status = "Lunas";

      const keuanganbaru = new Keuangan({
        tanggal: transaksi.tanggal,
        tipe: "Masuk",
        keterangan: "Order barang dari " + transaksi.namapembeli,
        nominal: transaksi.total,
        pendapatan: transaksi.pendapatan,
      });

      transaksi.save();
      keuanganbaru.save();

      req.flash("success", "Transaksi lunas");
      return res.redirect("/transaksi");
    })
    .catch((err) => {
      // console.log(err)
      req.flash("error", "Ada yang salah, silahkan hubungi developer");
      return res.redirect("/transaksi");
    });
};

exports.postHapusTransaksi = (req, res, next) => {
  const idtransaksi = req.body.idtransaksi;
  Transaksi.findOneAndDelete({ _id: idtransaksi })
    .then((result) => {
      req.flash("success", "Transaksi berhasil dihapus");
      res.redirect("/transaksi");
    })
    .catch((err) => {
      // console.log(err);
      req.flash("error", "Ada yang salah, silahkan hubungi developer");
      return res.redirect("/transaksi");
    });
};

exports.getMasukBarang = (req, res, next) => {
  let messageSuccess = req.flash("success");
  let messageError = req.flash("error");
  let message = [];

  if (messageSuccess.length > 0) {
    (message[0] = "success"), (message[1] = messageSuccess[0]);
  } else if (messageError.length > 0) {
    (message[0] = "error"), (message[1] = messageError[0]);
  } else {
    message = null;
  }

  BarangMasuk.find()
    .sort({ createdAt: -1 })
    .then((barangmasuk) => {
      res.render("admin/transaksi/masukbarang", {
        route: "/masukbarang",
        barangmasuk: barangmasuk,
        message: message,
      });
    });
};

exports.getTambahMasukBarang = (req, res, next) => {
  Barang.find()
    .then((barang) => {
      res.render("admin/transaksi/tambahmasukbarang", {
        route: "masukbarang",
        barangmasuk: null,
        barang: barang,
        message: null,
      });
    })
    .catch((err) => console.log(err));
};

exports.postTambahMasukBarang = (req, res, next) => {
  const namasupplier = req.body.namasupplier;
  const tanggal = req.body.tanggal;
  const status = req.body.status == "null" ? "Draft" : req.body.status;
  const idbarangpilihan = req.body.idbarang;
  const jumlah = req.body.jumlah;
  const harga = req.body.hargavalue;

  const barangmasukbaru = new BarangMasuk({
    namasupplier: namasupplier,
    tanggal: tanggal,
    status: status,
  });

  barangmasukbaru
    .tambahBarang({ idbarangpilihan, jumlah, harga })
    .then((result) => {
      if (result) {
        Barang.findOne({ _id: idbarangpilihan })
          .then((barang) => {
            barang.stok += parseInt(jumlah);
            return barang.save();
          })
          .then(() => {
            req.flash("success", "Berhasil menambahkan barang");
            return res.redirect(
              "/transaksi/masukbarang/edit/" + barangmasukbaru._id
            );
          })
          .catch((err) => console.log(err));
      } else {
        req.flash("error", "Gagal menambahkan barang");
        return res.redirect(
          "/transaksi/masukbarang/edit/" + barangmasukbaru._id
        );
      }
    })
    .catch((err) => {
      console.log(err);
      req.flash("error", "Gagal menambahkan barang");
      return res.redirect("/transaksi/masukbarang/edit/" + barangmasukbaru._id);
    });
};

exports.getEditMasukBarang = (req, res, next) => {
  const idbarangmasuk = req.params.idbarangmasuk;
  let messageSuccess = req.flash("success");
  let messageError = req.flash("error");
  let message = [];

  if (messageSuccess.length > 0) {
    (message[0] = "success"), (message[1] = messageSuccess[0]);
  } else if (messageError.length > 0) {
    (message[0] = "error"), (message[1] = messageError[0]);
  } else {
    message = null;
  }

  BarangMasuk.findOne({ _id: idbarangmasuk }).then((barangmasuk) => {
    Barang.find()
      .then((barang) => {
        res.render("admin/transaksi/tambahmasukbarang", {
          route: "/barangmasuk",
          barangmasuk: barangmasuk,
          barang: barang,
          message: message,
        });
      })
      .catch((err) => console.log(err));
  });
};

exports.postEditMasukBarang = async (req, res, next) => {
  const idbarangmasuk = req.params.idbarangmasuk;

  const namasupplier = req.body.namasupplier;
  const tanggal = req.body.tanggal;
  const idbarangpilihan = req.body.idbarang;
  const jumlah = req.body.jumlah;
  const harga = req.body.hargavalue;

  BarangMasuk.findOne({ _id: idbarangmasuk })
    .then((barangmasuk) => {
      barangmasuk.namasupplier = namasupplier;
      barangmasuk.tanggal = tanggal;
      return barangmasuk
        .tambahBarang({ idbarangpilihan, jumlah, harga })
        .then((result) => {
          if (result) {
            Barang.findOne({ _id: idbarangpilihan })
              .then((barang) => {
                barang.stok += jumlah;
                return barang.save();
              })
              .catch((err) => console.log(err));
          }
          // return res.redirect("/transaksi/masukbarang/edit/" + barangmasuk._id);
        })
        .catch((err) => {
          console.log(err);
          req.flash("error", "Ada yang salah, silahkan hubungi developer");
          return res.redirect("/transaksi/masukbarang/edit/" + barangmasuk._id);
        });
    })
    .then(() => {
      req.flash("success", "Berhasil menambahkan barang");
      return res.redirect("/transaksi/masukbarang/edit/" + idbarangmasuk);
    });
};

exports.postHapusBarangdiCartMasukBarang = (req, res, next) => {
  const idbarang = req.body.idbarang;
  const idbarangmasuk = req.body.idbarangmasuk;

  BarangMasuk.findOne({ _id: idbarangmasuk })
    .then((barangmasuk) => {
      return barangmasuk.hapusBarang(idbarang);
    })
    .then((result) => {
      req.flash("success", "Berhasil menghapus barang");
      return res.redirect("/transaksi/masukbarang/edit/" + idbarangmasuk);
    })
    .catch((err) => {
      console.log(err);
      req.flash("success", "Ada yang salah, silahkan hubungi developer");
      return res.redirect("/transaksi/masukbarang/edit/" + idbarangmasuk);
    });
};

exports.postHapusMasukBarang = (req, res, next) => {
  const idbarangmasuk = req.body.idbarangmasuk;
  BarangMasuk.findOneAndDelete({ _id: idbarangmasuk })
    .then((result) => {
      req.flash("success", "Berhasil menghapus barang");
      return res.redirect("/transaksi/masukbarang");
    })
    .catch((err) => {
      req.flash("error", "Ada yang salah, silahkan hubungi developer");
      console.log(err);
    });
};

exports.postBayarMasukBarang = (req, res, next) => {
  const idbarangmasuk = req.body.idbarangmasuk;

  BarangMasuk.findOne({ _id: idbarangmasuk })
    .then((barangmasuk) => {
      barangmasuk.status = "Lunas";

      const keuanganbaru = new Keuangan({
        tanggal: barangmasuk.tanggal,
        tipe: "Keluar",
        keterangan: "Pesan barang dari supplier " + barangmasuk.namasupplier,
        nominal: barangmasuk.total,
      });

      barangmasuk.save();
      keuanganbaru.save();

      req.flash("success", "Berhasil transaksi telah lunas");
      return res.redirect("/transaksi/masukbarang");
    })
    .catch((err) => {
      console.log(err);
      req.flash("error", "Ada yang salah, silahkan hubungi developer");
      return res.redirect("/transaksi/masukbarang");
    });
};

exports.getKategoriBarang = (req, res, next) => {
  let messageSuccess = req.flash("success");
  let messageError = req.flash("error");
  let message = [];

  if (messageSuccess.length > 0) {
    (message[0] = "success"), (message[1] = messageSuccess[0]);
  } else if (messageError.length > 0) {
    (message[0] = "error"), (message[1] = messageError[0]);
  } else {
    message = null;
  }

  Kategori.find()
    .then((kategori) => {
      res.render("admin/kategori/kategoribarang", {
        kategori: kategori,
        route: "/kategori",
        message: message,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postTambahKategoriBarang = (req, res, next) => {
  try {
    const kategori = req.body.kategori;

    const kategoribaru = new Kategori({
      kategori: kategori,
    });
    // console.log(req.file.cloudStoragePublicUrl)
    if (req.file && !req.file.cloudStorageError) {
      // console.log('gagal')
      kategoribaru.image = req.file.cloudStoragePublicUrl;
    }

    req.flash("success", "Kategori berhasil disimpan");
    kategoribaru.save();

    return res.redirect("/kategori");
  } catch (err) {
    console.log(err);
    req.flash("error", "Ada yang salah, silahkan hubungi developer");
    return res.redirect("/kategori");
  }
};

exports.postEditKategoriBarang = (req, res, next) => {
  const idkategori = req.params.idkategori;
  const namakategori = req.body.kategori;
  let image = null;

  Kategori.findOne({ _id: idkategori })
    .then((kategori) => {
      kategori.kategori = namakategori;

      if (req.file && !req.file.cloudStorageError) {
        kategori.image = req.file.cloudStoragePublicUrl;
      }

      kategori.save();

      req.flash("success", "Kategori berhasil diedit");
      return res.redirect("/kategori");
    })
    .catch((err) => {
      console.log(err);
      req.flash("error", "Ada yang salah, silahkan hubungi developer");
      return res.redirect("/kategori");
    });
};

exports.postHapusKategoriBarang = (req, res, next) => {
  const idkategori = req.body.idkategorifordeleted;
  Kategori.findOne({ _id: idkategori })
    .then((kategori) => {
      if (!req.succesDelete) {
        console.log("Gagal menghapus foto");
      }
      return Kategori.findOneAndDelete({ _id: idkategori });
    })
    .then((result) => {
      req.flash("success", "Kategori berhasil dihapus");
      return res.redirect("/kategori");
    })
    .catch((err) => {
      console.log(err);
      req.flash("error", "Ada yang salah, silahkan hubungi developer");
      return res.redirect("/kategori");
    });
};

exports.getKaryawan = (req, res, next) => {
  let messageSuccess = req.flash("success");
  let messageError = req.flash("error");
  let message = [];

  if (messageSuccess.length > 0) {
    (message[0] = "success"), (message[1] = messageSuccess[0]);
  } else if (messageError.length > 0) {
    (message[0] = "error"), (message[1] = messageError[0]);
  } else {
    message = null;
  }

  Karyawan.find()
    .then((karyawan) => {
      res.render("admin/karyawan/karyawan", {
        karyawan: karyawan,
        route: "/karyawan",
        message: message,
      });
    })
    .catch((err) => console.log(err));
};

exports.getTambahKaryawan = (req, res, next) => {
  res.render("admin/karyawan/tambahkaryawan", {
    route: "/karyawan",
    karyawan: null,
  });
};

exports.postTambahKaryawan = (req, res, next) => {
  const nama = req.body.namakaryawan;
  const ktp = req.body.noktp;
  const alamat = req.body.alamat;
  const gaji = req.body.gaji;
  const status = req.body.status;

  const karyawan = new Karyawan({
    nama: nama,
    nomorktp: ktp,
    alamat: alamat,
    gaji: gaji,
    status: status,
  });

  karyawan.save();

  req.flash("success", "Karyawan berhasil ditambahkan");
  return res.redirect("/karyawan");
};

exports.getEditKaryawan = (req, res, next) => {
  const idkaryawan = req.params.idkaryawan;

  Karyawan.findOne({ _id: idkaryawan }).then((karyawan) => {
    return res.render("admin/karyawan/tambahkaryawan", {
      route: "/karyawan",
      karyawan: karyawan,
    });
  });
};

exports.postEditKaryawan = (req, res, next) => {
  const idkaryawan = req.params.idkaryawan;
  const nama = req.body.namakaryawan;
  const ktp = req.body.noktp;
  const alamat = req.body.alamat;
  const gaji = req.body.gaji;
  const status = req.body.status;

  Karyawan.findOne({ _id: idkaryawan })
    .then((karyawan) => {
      karyawan.nama = nama;
      karyawan.nomorktp = ktp;
      karyawan.alamat = alamat;
      karyawan.gaji = gaji;
      karyawan.status = status;

      return karyawan.save();
    })
    .then((result) => {
      req.flash("success", "Data karyawan berhasil di update");
      return res.redirect("/karyawan");
    })
    .catch((err) => console.log(err));
};

exports.postBayarGajiKaryawan = (req, res, next) => {
  const idkaryawan = req.params.idkaryawan;

  const date = new Date();
  const stringBuildDate = date.toISOString().split("T")[0];

  const bulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "Oktober",
    "November",
    "Desember",
  ];

  Karyawan.findOne({ _id: idkaryawan })
    .then((karyawan) => {
      if (!karyawan.cekGajiBulanIni()) {
        const keuangan = new Keuangan({
          tanggal: stringBuildDate,
          tipe: "Keluar",
          keterangan:
            "Bayar gaji " +
            karyawan.nama +
            " bulan " +
            bulan[parseInt(date.getMonth()) - 1] +
            " " +
            date.getFullYear(),
          nominal: karyawan.gaji,
        });

        try {
          karyawan.riwayatgaji.push({
            bulan: parseInt(date.getMonth()),
            tahun: date.getFullYear(),
          });
          karyawan.save();
          keuangan.save();
          req.flash("success", "Gaji karyawan telah terdaftar");
        } catch (err) {
          console.log(err);
          req.flash("error", "Ada yang salah, silahkan hubungi developer");
        }
      } else {
        req.flash("error", "Karyawan telah digaji bulan ini");
      }
    })
    .catch((err) => {
      console.log(err);
      req.flash("error", "Ada yang salah, silahkan hubungi developer");
    });

  return res.redirect("/karyawan");
};

exports.getLaporanKeuangan = (req, res, next) => {
  const bulanmulai = req.query.bulanmulai + "-01";
  const bulanselesai = req.query.bulanselesai + "-31";
  if (req.query.bulanmulai || req.query.bulanselesai) {
    Keuangan.find({ tanggal: { $gte: bulanmulai, $lte: bulanselesai } })
      .sort({ createdAt: -1 })
      .then((keuangan) => {
        res.render("admin/laporan/daftarkeuangan", {
          route: "/daftar",
          keuangan: keuangan,
          bulanmulai: req.query.bulanmulai,
          bulanselesai: req.query.bulanselesai,
        });
      })
      .catch((err) => console.log(err));
  } else {
    Keuangan.find()
      .then((keuangan) => {
        res.render("admin/laporan/daftarkeuangan", {
          route: "/daftar",
          keuangan: keuangan,
          bulanmulai: null,
          bulanselesai: null,
        });
      })
      .catch((err) => console.log(err));
  }
};

exports.getTambahDaftarKeuangan = (req, res, next) => {
  return res.render("admin/laporan/tambahdaftarkeuangan", {
    route: "laporan",
    keuangan: false,
  });
};

exports.postTambahDatfarKeuangan = (req, res, next) => {
  const tanggal = req.body.tanggal;
  const tipe = req.body.tipe;
  const keterangan = req.body.keterangan;
  const nominal = req.body.nominal;

  const keuanganbaru = new Keuangan({
    tanggal: tanggal,
    tipe: tipe,
    keterangan: keterangan,
    nominal: nominal,
  });

  keuanganbaru.save();
  return res.redirect("/daftarkeuangan");
};

exports.getEditDaftarKeuangan = (req, res, next) => {
  const iddaftar = req.params.iddaftar;
  Keuangan.findOne({ _id: iddaftar }).then((keuangan) => {
    res.render("admin/laporan/tambahdaftarkeuangan", {
      route: "/daftarkeuangan",
      keuangan: keuangan,
    });
  });
};

exports.postEditDaftarKeuangan = (req, res, next) => {
  const iddaftar = req.params.iddaftar;
  const tanggal = req.body.tanggal;
  const tipe = req.body.tipe;
  const keterangan = req.body.keterangan;
  const nominal = req.body.nominal;

  Keuangan.findOne({ _id: iddaftar })
    .then((keuangan) => {
      keuangan.tanggal = tanggal;
      keuangan.tipe = tipe;
      keuangan.keterangan = keterangan;
      keuangan.nominal = nominal;

      return keuangan.save();
    })
    .then((res) => {
      return res.redirect("/daftarbarang");
    })
    .catch((err) => console.log(err));
};

exports.postHapusDaftarKeuangan = (req, res, next) => {
  const iddaftarkeuangan = req.body.iddaftarkeuangan;
  Keuangan.findByIdAndDelete(iddaftarkeuangan)
    .then((result) => {
      return res.redirect("/daftarkeuangan");
    })
    .catch((err) => console.log(err));
};
