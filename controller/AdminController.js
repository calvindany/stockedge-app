const fs = require('fs');
const path = require('path');
const Barang = require("../model/barang");
const Transaksi = require("../model/transaction");
const Kategori = require("../model/kategori");
const Karyawan = require("../model/karyawan");
const Keuangan = require("../model/keuangan");
const RiwayatKeuangan = require("../model/riwayatKeuangan");
const BarangMasuk = require('../model/barangmasuk');

const fileHelper = require('../util/fileDelete');
const sharp = require('sharp');

exports.getDashboard = (req, res, next) => {
  const date = new Date();
  let keuntunganHarian = {};
  let keluaranHarian = {};

  Transaksi.find()
  .limit(5)
  .then( transaksi => {
    RiwayatKeuangan.findOne({tahun : '2023'})
    .then( riwayat => {
      // console.log(riwayat.getKeuntunganHariIni())
      riwayat.getKeuntunganHariIni(date)
      .then( keuntungan => {
        keuntunganHarian = keuntungan;
        return riwayat.getKeluaranHariIni(date)
      })
      .then( keluaran => {
        return keluaranHarian = keluaran;
      })
      .then( result => {
        return res.render("admin/dashboard/dashboard2", {
          route: "/dashboard",
          transaksi: transaksi,
          keuntunganHarian: keuntunganHarian,
          keluaranHarian: keluaranHarian,
          riwayatKeuangan: riwayat,
        });
      })
    })
  })
  .catch( err => {
    console.log(err);
  })
};

exports.getBarang = (req, res, next) => {
  let messageSuccess = req.flash('success');
  let messageFailed = req.flash('failed');
  let message = [];

  if(messageSuccess.length > 0){
    message[0] = 'success',
    message[1] = messageSuccess[0]
  } else if(messageFailed.length > 0) {
    message[0] = 'failed',
    message[1] = messageFailed[0]
  }else {
    message = null;
  }

  Kategori.find()
  .then( kategori => {
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
  let image;

  const newbarang = new Barang({
    namabarang: namabarang,
    kategori: kategori,
    stok: stok,
    harga: harga,
    modal: modal,
  });

  if(req.file){
    newbarang.image = req.file.filename;
    sharp(path.join(__dirname, '../public/images/') + newbarang.image)
    .resize(400, 400)
    .toFile(path.join(__dirname, '../public/images/') + 'temp_' + newbarang.image, (err, info) => {
      if(err) {
        console.log(err);
      }

      //Hapus gambar sebelum di resize
      fileHelper.deleteFile(path.join(__dirname, '../public/images/') + newbarang.image)

      //Menganti nama gambar yang sudah diresze ke nama awal (tanpa temp_)
      fileHelper.renameFile(newbarang.image);
    });
  }

  req.flash('success', 'Barang berhasil disimpan');
  newbarang.save();
  return res.redirect("/barang");
};

exports.postEditBarang = (req, res, next) => {
  const idupdatedbarang = req.body.idupdatedbarang;
  const newnamabarang = req.body.namabarang;
  const newstok = req.body.stok;
  const newharga = req.body.harga;
  const newmodal = req.body.modal;
  let image;

  if(req.file){
    image = req.file.filename;
  }

  Barang.findOne({ _id: idupdatedbarang }).then((barang) => {
    barang.namabarang = newnamabarang;
    barang.stok = newstok;
    barang.harga = newharga;
    barang.modal = newmodal;

    if (fs.existsSync(path.join(__dirname, '../public/images/') + barang.image) && image) {
      fileHelper.deleteFile(path.join(__dirname, '../public/images/') + barang.image)
      barang.image = image;

      sharp(path.join(__dirname, '../public/images/') + barang.image)
      .resize(400, 400)
      .toFile(path.join(__dirname, '../public/images/') + 'temp_' + barang.image, (err, info) => {
        if(err) {
          console.log(err);
        }

        //Hapus gambar sebelum di resize
        fileHelper.deleteFile(path.join(__dirname, '../public/images/') + barang.image)

        //Menganti nama gambar yang sudah diresze ke nama awal (tanpa temp_)
        fileHelper.renameFile(barang.image)
      })
    } else if (image) {
      barang.image = image;

      sharp(path.join(__dirname, '../public/images/') + barang.image)
      .resize(800, 600)
      .toFile(path.join(__dirname, '../public/images/') + 'temp_' + barang.image, (err, info) => {
        if(err) {
          console.log(err);
        }

        //Hapus gambar sebelum di resize
        fileHelper.deleteFile(path.join(__dirname, '../public/images/') + barang.image)

        //Menganti nama gambar yang sudah diresze ke nama awal (tanpa temp_)
        fileHelper.renameFile(barang.image)
      })
    } else if (barang.image){
      barang.image = barang.image;
    } else {
      barang.image = 'null';
    }

    barang.save();
    req.flash('success', 'Barang berhasil diedit');

    return res.redirect("/barang");
  })
  .catch( err => {
    console.log(err);
    req.flash('failed', 'Ada yang salah, silahkan hubungi developer');
    return res.redirect('/barang');
  });
};

exports.postDeleteBarang = (req, res, next) => {
  const idbarang = req.body.idbarangfordeleted;
  Barang.findOne({ _id: idbarang })
  .then( barang => {
    try {
      if (fs.existsSync(path.join(__dirname, '../public/images/') + barang.image)) {
        fileHelper.deleteFile(path.join(__dirname, '../public/images/') + barang.image)
      }
    } catch (err) {
      req.flash('failed', 'Ada yang salah, silahkan hubungi developer');
      return res.redirect("/barang");
    }
    return Barang.findOneAndDelete({ _id: idbarang })
  })
  .then((result) => {
    req.flash('success', 'Barang berhasil dihapus');
    return res.redirect("/barang");
  })
  .catch( err => {
    req.flash('failed', 'Ada yang salah, silahkan hubungi developer');
    console.log(err);
    return res.redirect('/barang');
  });
};

exports.getTransaksi = (req, res, next) => {
  Transaksi.find()
    .then((transaksi) => {
      res.render("admin/transaksi/transaksi", {
        route: "/transaksi",
        transaksi: transaksi,
      });
    })
    .catch((err) => console.log(err));
};

exports.getTambahTransaksi = (req, res, next) => {
  Barang.find().then((barang) => {
    res.render("admin/transaksi/tambahtransaksi", {
      route: "/transaksi/tambah",
      barang: barang,
      transaksi: null,
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

  transaksibaru.tambahBarang({ idbarangpilihan, namabarang, jumlah, harga })
  .then( result => {
    Barang.findOne({ _id: idbarangpilihan })
    .then(barang => {
      barang.stok -= jumlah;

      barang.save();
    })
    .catch( err => console.log(err) );
    
    return transaksibaru.hitungKeuntungan();
  })
  .then( result => {
    return res.redirect("/transaksi/edit/" + transaksibaru._id);
  })
  .catch( err => console.log(err) )
};

exports.getEditTransaksi = (req, res, next) => {
  const idtransaksi = req.params.idtransaksi;
  Transaksi.findOne({ _id: idtransaksi }).then((transaksi) => {
    Barang.find().then((barang) => {
      res.render("admin/transaksi/tambahtransaksi", {
        route: "/transaksi",
        transaksi: transaksi,
        barang: barang,
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

  Transaksi.findOne({ _id: idtransaksi })
    .then((transaksi) => {
      transaksi.namapembeli = namapembeli;
      transaksi.tanggal = tanggal;
      transaksi.tambahBarang({ idbarangpilihan, jumlah, harga })
      .then( () => {
        Barang.findOne({ _id: idbarangpilihan })
        .then(barang => {
          barang.stok -= jumlah;
          barang.save();
        })
        .catch( err => console.log(err) );
        return transaksi.hitungKeuntungan();
      })
      .catch( err => { console.log(err) })
    })
    .then(() => {
      return res.redirect("/transaksi/edit/" + idtransaksi);
    })
    .catch( err => { console.log(err) });
};

exports.postHapusBarangdiCart = (req, res, next) => {
  const idbarang = req.body.idbarang;
  const idtransaksi = req.body.idtransaksi;

  Transaksi.findOne({ _id: idtransaksi })
    .then((transaksi) => {
      return transaksi.hapusBarang(idbarang);
    })
    .then((result) => {
      return res.redirect("/transaksi/edit/" + idtransaksi);
    })
    .catch((err) => console.log(err));
};

exports.postLunasOrderMasuk = (req, res, next) => {
  const idtransaksi = req.body.idtransaksi;
  const date = new Date();
  Transaksi.findOne({_id: idtransaksi})
  .then( transaksi => {
    transaksi.status = 'Lunas';
    
    const keuanganbaru = new Keuangan({
      tanggal: transaksi.tanggal,
      tipe: 'Masuk',
      keterangan: 'Order barang dari ' + transaksi.namapembeli,
      nominal: transaksi.total,
      pendapatan: transaksi.pendapatan,
    })

    transaksi.save();
    keuanganbaru.save();

    return res.redirect('/transaksi')
  })
  .catch(err => console.log(err));
};

exports.postHapusTransaksi = (req, res, next) => {
  const idtransaksi = req.body.idtransaksi;
  Transaksi.findOneAndDelete({ _id: idtransaksi })
    .then((result) => {
      res.redirect("/transaksi");
    })
    .catch((err) => console.log(err));
};

exports.getMasukBarang = (req, res, next) => {
  BarangMasuk.find()
  .then( barangmasuk => {
    res.render('admin/transaksi/masukbarang', {
      route: '/masukbarang',
      barangmasuk: barangmasuk,
    });
  })
}

exports.getTambahMasukBarang = (req, res, next) => {
  Barang.find()
  .then( barang => {
    res.render('admin/transaksi/tambahmasukbarang', {
      route: 'masukbarang',
      barangmasuk: null,
      barang: barang,
    })
  })
  .catch( err => console.log(err));
}

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
  })

  barangmasukbaru.tambahBarang({ idbarangpilihan, jumlah, harga })
  .then( (result) => {
    if(result){
      Barang.findOne({ _id: idbarangpilihan })
      .then( barang => {
        barang.stok += parseInt(jumlah);
        return barang.save();
      })
      .then( () => {
        return res.redirect("/transaksi/masukbarang/edit/" + barangmasukbaru._id);
      })
      .catch( err => console.log(err) );
    } else {
      return res.redirect("/transaksi/masukbarang/edit/" + barangmasukbaru._id);
    }
  })
  .catch(err => {
    console.log(err);
    return res.redirect("/transaksi/masukbarang/edit/" + barangmasukbaru._id);
  });
};

exports.getEditMasukBarang = (req, res, next) => {
  const idbarangmasuk = req.params.idbarangmasuk;
  BarangMasuk.findOne({ _id: idbarangmasuk }).then((barangmasuk) => {
    Barang.find().then((barang) => {
      res.render("admin/transaksi/tambahmasukbarang", {
        route: "/barangmasuk",
        barangmasuk: barangmasuk,
        barang: barang,
      });
    })
    .catch( err => console.log(err) );
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
      barangmasuk.tambahBarang({ idbarangpilihan, jumlah, harga })
      .then( (result) => {
        if(result){
          Barang.findOne({ _id: idbarangpilihan })
          .then( barang => {
            barang.stok += jumlah;
            barang.save();
            return res.redirect("/transaksi/masukbarang/edit/" + barangmasuk._id);
          })
          .catch( err => console.log(err) );
        }
        // return res.redirect("/transaksi/masukbarang/edit/" + barangmasuk._id);
      })
      .catch(err => {
        console.log(err) 
        return res.redirect("/transaksi/masukbarang/edit/" + barangmasuk._id);
      });
    })
    .then(() => {
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
      return res.redirect("/transaksi/masukbarang/edit/" + idbarangmasuk);
    })
    .catch((err) => console.log(err));
};

exports.postHapusMasukBarang = (req, res, next) => {
  const idbarangmasuk = req.body.idbarangmasuk;
  BarangMasuk.findOneAndDelete({ _id: idbarangmasuk })
    .then((result) => {
      res.redirect("/transaksi/masukbarang");
    })
    .catch((err) => console.log(err));
};

exports.postBayarMasukBarang = (req, res, next) => {
  const idbarangmasuk = req.body.idbarangmasuk;

  BarangMasuk.findOne({_id: idbarangmasuk})
  .then( barangmasuk => {
    barangmasuk.status = 'Lunas';

    const keuanganbaru = new Keuangan({
      tanggal: barangmasuk.tanggal,
      tipe: 'Keluar',
      keterangan: 'Pesan barang dari supplier ' + barangmasuk.namasupplier,
      nominal: barangmasuk.total,
    })

    barangmasuk.save();
    keuanganbaru.save();

    return res.redirect('/transaksi/masukbarang')
  })
  .catch(err => console.log(err));
};

exports.getKategoriBarang = (req, res, next) => {
  Kategori.find()
  .then( kategori => {
    res.render('admin/kategori/kategoribarang', {
      kategori: kategori,
      route: '/kategori'
    })
  })
  .catch( err => {
    console.log(err);
  })
}

exports.postTambahKategoriBarang = (req, res, next) => {
  const kategori = req.body.kategori;
  let image;

  if(req.file){
    image = req.file.filename;
  }

  const kategoribaru = new Kategori({
    kategori: kategori,
    image: image,
  })

  sharp(path.join(__dirname, '../public/images/') + kategoribaru.image)
    .resize(400, 400)
    .toFile(path.join(__dirname, '../public/images/') + 'temp_' + kategoribaru.image, (err, info) => {
      if(err) {
        console.log(err);
      }

      //Hapus gambar sebelum di resize
      fileHelper.deleteFile(path.join(__dirname, '../public/images/') + kategoribaru.image)

      //Menganti nama gambar yang sudah diresze ke nama awal (tanpa temp_)
      fileHelper.renameFile(kategoribaru.image)
    })

  kategoribaru.save()

  return res.redirect('/kategori')
}

exports.postEditKategoriBarang = (req, res, next) => {
  const idkategori = req.params.idkategori;
  const namakategori = req.body.kategori;
  let image;

  if(req.file){
    image = req.file.filename;
  }

  Kategori.findOne({ _id: idkategori })
  .then( kategori => {
    kategori.kategori = namakategori;

    if (fs.existsSync(path.join(__dirname, '../public/images/') + kategori.image) && image) {
      fileHelper.deleteFile(path.join(__dirname, '../public/images/') + kategori.image)
      kategori.image = image;

      sharp(path.join(__dirname, '../public/images/') + kategori.image)
      .resize(400, 400)
      .toFile(path.join(__dirname, '../public/images/') + 'temp_' + kategori.image, (err, info) => {
        if(err) {
          console.log(err);
        }

        //Hapus gambar sebelum di resize
        fileHelper.deleteFile(path.join(__dirname, '../public/images/') + kategori.image)

        //Menganti nama gambar yang sudah diresze ke nama awal (tanpa temp_)
        fileHelper.renameFile(kategori.image)
      })
    } else if (image) {
      kategori.image = image;

      sharp(path.join(__dirname, '../public/images/') + kategori.image)
      .resize(400, 400)
      .toFile(path.join(__dirname, '../public/images/') + 'temp_' + kategori.image, (err, info) => {
        if(err) {
          console.log(err);
        }

        //Hapus gambar sebelum di resize
        fileHelper.deleteFile(path.join(__dirname, '../public/images/') + kategori.image)

        //Menganti nama gambar yang sudah diresze ke nama awal (tanpa temp_)
        fileHelper.renameFile(kategori.image)
      })
    } else if (kategori.image){
      kategori.image = kategori.image;
    } else {
      kategori.image = 'null';
    }

    kategori.save();
    return res.redirect("/kategori");
  })
  .catch( err => console.log(err) );
}

exports.postHapusKategoriBarang = (req, res, next) => {
  const idkategori = req.body.idkategorifordeleted
  Kategori.findOne({ _id: idkategori })
  .then( kategori => {
    try {
      if (fs.existsSync(path.join(__dirname, '../public/images/') + kategori.image)) {
        fileHelper.deleteFile(path.join(__dirname, '../public/images/') + kategori.image)
        return Kategori.findOneAndDelete({ _id: idkategori })
      }
    } catch (err) {
      return res.redirect("/kategori");
    }
  })
  .then( result => {
    return res.redirect("/kategori");
  })
  .catch( err => console.log(err) );
}

exports.getKaryawan = (req, res, next) => {
  Karyawan.find()
  .then ( karyawan => {
    res.render('admin/karyawan/karyawan', {
      karyawan: karyawan,
      route : '/karyawan'
    });
  })
  .catch( err => console.log(err) );
}

exports.getTambahKaryawan = (req, res, next) => {
    res.render('admin/karyawan/tambahkaryawan', {
      route: '/karyawan',
      karyawan: null,
    })
}

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
  })

  karyawan.save();

  return res.redirect('/karyawan')
}

exports.getEditKaryawan = (req, res, next) => {
  const idkaryawan = req.params.idkaryawan;

  Karyawan.findOne({ _id: idkaryawan })
  .then( karyawan => {
    return res.render('admin/karyawan/tambahkaryawan', {
      route: '/karyawan',
      karyawan: karyawan,
    })
  })
}

exports.postEditKaryawan = (req, res, next) => {
  const idkaryawan = req.params.idkaryawan;
  const nama = req.body.namakaryawan;
  const ktp = req.body.noktp;
  const alamat = req.body.alamat;
  const gaji = req.body.gaji;
  const status = req.body.status;

  Karyawan.findOne({ _id: idkaryawan })
  .then( karyawan => {
    karyawan.nama = nama;
    karyawan.nomorktp = ktp;
    karyawan.alamat = alamat;
    karyawan.gaji = gaji;
    karyawan.status = status;

    return karyawan.save();
  })
  .then( result => {
    return res.redirect('/karyawan');
  })
  .catch(err => console.log(err));
}

exports.postBayarGajiKaryawan = (req, res, next) => {
  const idkaryawan = req.params.idkaryawan;
  
  const date = new Date();
  const stringBuildDate = date.toISOString().split('T')[0];

  const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'Oktober', 'November', 'Desember'];

  Karyawan.findOne({ _id: idkaryawan })
  .then( karyawan => {
    if(!karyawan.cekGajiBulanIni()){      
      const keuangan = new Keuangan({
        tanggal: stringBuildDate,
        tipe: 'Keluar',
        keterangan: 'Bayar gaji ' + karyawan.nama + ' bulan ' + bulan[parseInt(date.getMonth()) - 1] + ' ' + date.getFullYear(),
        nominal: karyawan.gaji,
      });
      
      try {
        karyawan.riwayatgaji.push({bulan: month, tahun: year});
        karyawan.save();
        keuangan.save();
      } catch (err) {
        console.log(err);
      }
    }
  })
  .catch(err => {
    console.log(err);
  });

  return res.redirect('/karyawan');
}

exports.getLaporanKeuangan = (req, res, next) => {
  const bulanmulai = req.query.bulanmulai + '-01'
  const bulanselesai = req.query.bulanselesai + '-31'
  if(req.query.bulanmulai || req.query.bulanselesai){
    Keuangan.find({tanggal: {$gte: bulanmulai, $lte: bulanselesai}})
    .then( keuangan => {
      res.render('admin/laporan/daftarkeuangan', {
        route: '/daftar',
        keuangan: keuangan,
        bulanmulai: req.query.bulanmulai,
        bulanselesai: req.query.bulanselesai,
      })
    })
    .catch( err => console.log(err) );
  } else {
    Keuangan.find()
    .then( keuangan => {
      res.render('admin/laporan/daftarkeuangan', {
        route: '/daftar',
        keuangan: keuangan,
        bulanmulai: null,
        bulanselesai: null,
      })
    })
    .catch( err => console.log(err) );
  }
}

exports.getTambahDaftarKeuangan = (req, res, next) => {
  return res.render('admin/laporan/tambahdaftarkeuangan',{
    route: 'laporan',
    keuangan: false,
  })
}

exports.postTambahDatfarKeuangan = (req, res, next) => {
  const tanggal = req.body.tanggal;
  const tipe = req.body.tipe;
  const keterangan = req.body.keterangan;
  const nominal  = req.body.nominal;

  const keuanganbaru = new Keuangan({
    tanggal: tanggal,
    tipe: tipe,
    keterangan: keterangan,
    nominal: nominal,
  })

  keuanganbaru.save();
  return res.redirect('/daftarkeuangan');
}

exports.getEditDaftarKeuangan = (req, res, next) => {
  const iddaftar = req.params.iddaftar;
  Keuangan.findOne({ _id: iddaftar})
  .then( keuangan => {
    res.render('admin/laporan/tambahdaftarkeuangan', {
      route: '/daftarkeuangan',
      keuangan: keuangan,
    });
  })
}

exports.postEditDaftarKeuangan = (req, res, next) => {
  const iddaftar = req.params.iddaftar;
  const tanggal = req.body.tanggal;
  const tipe = req.body.tipe;
  const keterangan = req.body.keterangan;
  const nominal = req.body.nominal;

  Keuangan.findOne({ _id: iddaftar })
  .then(keuangan => {
    keuangan.tanggal = tanggal;
    keuangan.tipe = tipe;
    keuangan.keterangan = keterangan;
    keuangan.nominal = nominal;

    return keuangan.save();
  })
  .then( res => {
    return res.redirect('/daftarbarang');
  })
  .catch( err => console.log(err) );

}

exports.postHapusDaftarKeuangan = (req, res, next) => {
  const iddaftarkeuangan = req.body.iddaftarkeuangan;
  Keuangan.findByIdAndDelete(iddaftarkeuangan)
  .then( result => {
    return res.redirect('/daftarkeuangan');
  })
  .catch( err => console.log(err) );
}