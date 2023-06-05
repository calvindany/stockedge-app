const fs = require('fs');
const path = require('path')
const Barang = require("../model/barang");
const Transaksi = require("../model/transaction");
const Kategori = require("../model/kategori");
const Karyawan = require("../model/karyawan");
const Keuangan = require("../model/keuangan");
const BarangMasuk = require('../model/barangmasuk');

const fileHelper = require('../util/fileDelete');

exports.getDashboard = (req, res, next) => {
  let isAdmin = false;
  // if (req.admin) {
  //   isAdmin = true;
  // }
  Transaksi.find()
  .limit(5)
  .then( transaksi => {
    res.render("admin/dashboard/dashboard", {
      route: "/dashboard",
      transaksi: transaksi,
    });
  })
};

exports.getBarang = (req, res, next) => {
  Kategori.find()
  .then( kategori => {
    Barang.find()
      .then((barang) => {
        res.render("admin/barang/barang", {
          title: "Inventaris Barang",
          route: "/barang",
          barang: barang,
          kategori: kategori,
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

  if(req.file){
    image = req.file.filename;
  }

  const newbarang = new Barang({
    namabarang: namabarang,
    kategori: kategori,
    stok: stok,
    harga: harga,
    modal: modal,
    image: image,
  });

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
    } else if (image) {
      barang.image = image;
    } else if (barang.image){
      barang.image = barang.image;
    } else {
      barang.image = 'null';
    }

    barang.save();

    return res.redirect("/barang");
  });
};

exports.postDeleteBarang = (req, res, next) => {
  const idbarang = req.body.idbarangfordeleted;
  Barang.findOne({ _id: idbarang })
  .then( barang => {
    try {
      if (fs.existsSync(path.join(__dirname, '../public/images/') + barang.image)) {
        fileHelper.deleteFile(path.join(__dirname, '../public/images/') + barang.image)
        return Barang.findOneAndDelete({ _id: idbarang })
      }
    } catch (err) {
      return res.redirect("/barang");
    }
  })
  .then((result) => {
    return res.redirect("/barang");
  })
  .catch( err => {
    console.log(err);
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
  const jumlah = req.body.jumlah;
  const harga = req.body.hargavalue;

  const transaksibaru = new Transaksi({
    namapembeli: namapembeli,
    tanggal: tanggal,
    status: status,
  });
  transaksibaru.tambahBarang({ idbarangpilihan, jumlah, harga });

  return res.redirect("/transaksi/edit/" + transaksibaru._id);
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
      return transaksi.tambahBarang({ idbarangpilihan, jumlah, harga });
    })
    .then(() => {
      return res.redirect("/transaksi/edit/" + idtransaksi);
    });
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

exports.postBayarOrderMasuk = (req, res, next) => {
  const idtransaksi = req.body.idtransaksi;
  const date = new Date();

  Transaksi.findOne({_id: idtransaksi})
  .then( transaksi => {
    transaksi.status = 'Lunas';

    const keuanganbaru = new Keuangan({
      tanggal: date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate(),
      tipe: 'Masuk',
      keterangan: 'Order barang dari ' + transaksi.namapembeli,
      nominal: transaksi.total,
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

  barangmasukbaru.tambahBarang({ idbarangpilihan, jumlah, harga });

  return res.redirect("/transaksi/masukbarang/edit/" + barangmasukbaru._id);
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
    });
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
      barangmasuk.tambahBarang({ idbarangpilihan, jumlah, harga });
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
  const date = new Date();

  BarangMasuk.findOne({_id: idbarangmasuk})
  .then( barangmasuk => {
    barangmasuk.status = 'Lunas';

    const keuanganbaru = new Keuangan({
      tanggal: date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate(),
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

exports.postKategoriBarang = (req, res, next) => {
  const kategori = req.body.kategori;
  let image;

  if(req.file){
    image = req.file.filename;
  }

  const kategoribaru = new Kategori({
    kategori: kategori,
    image: image,
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
    } else if (image) {
      kategori.image = image;
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
  const month = date.getMonth();
  const year = date.getFullYear();

  const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'Oktober', 'November', 'Desember'];

  Karyawan.findOne({ _id: idkaryawan })
  .then( karyawan => {
    if(!karyawan.cekGajiBulanIni()){      
      const keuangan = new Keuangan({
        tanggal: date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate(),
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