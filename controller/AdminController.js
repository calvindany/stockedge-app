const Barang = require("../model/barang");
const Transaksi = require("../model/transaction");
const Kategori = require("../model/kategori");
const Karyawan = require("../model/karyawan");
const Keuangan = require("../model/keuangan");

exports.getDashboard = (req, res, next) => {
  let isAdmin = false;
  if (req.admin) {
    isAdmin = true;
  }
  res.render("admin/dashboard/dashboard", {
    route: "/dashboard",
    isAdmin: isAdmin,
  });
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

  const newbarang = new Barang({
    namabarang: namabarang,
    kategori: kategori,
    stok: stok,
    harga: harga,
    modal: modal,
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

  Barang.findOne({ _id: idupdatedbarang }).then((barang) => {
    barang.namabarang = newnamabarang;
    barang.stok = newstok;
    barang.harga = newharga;
    barang.modal = newmodal;

    barang.save();

    return res.redirect("/barang");
  });
};

exports.postDeleteBarang = (req, res, next) => {
  const idbarang = req.body.idbarangfordeleted;
  Barang.findOneAndDelete({ _id: idbarang }).then((result) => {
    res.redirect("/barang");
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

exports.postHapusTransaksi = (req, res, next) => {
  const idtransaksi = req.body.idtransaksi;
  Transaksi.findOneAndDelete({ _id: idtransaksi })
    .then((result) => {
      res.redirect("/transaksi");
    })
    .catch((err) => console.log(err));
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
  const kategoribaru = new Kategori({
    kategori: kategori,
  })
  
  kategoribaru.save()

  return res.redirect('/kategori')
}

exports.postEditKategoriBarang = (req, res, next) => {
  const idkategori = req.params.idkategori;
  const kategori = req.body.kategori;

  Kategori.findOne({ _id: idkategori })
  .then( kategori => {
    kategori.kategori = kategori;

    return kategori.save();
  })
  .catch( err => console.log(err) );
}

exports.postHapusKategoriBarang = (req, res, next) => {
  const kategori = req.body.idkategorifordeleted
  
  Kategori.findByIdAndDelete(kategori)
  .then( result => res.redirect('/kategori'))
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
      route: '/karyawan'
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

exports.getLaporanKeuangan = (req, res, next) => {
  const bulanmulai = req.query.bulanmulai + '-01'
  const bulanselesai = req.query.bulanselesai + '-31'
  if(req.query.bulanmulai || req.query.bulanselesai){
    Keuangan.find({tanggal: {$gte: bulanmulai, $lte: bulanselesai}})
    .then( keuangan => {
      res.render('admin/laporan/daftarkeuangan', {
        route: '/laporan',
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
        route: '/laporan',
        keuangan: keuangan,
        bulanmulai: null,
        bulanselesai: null,
      })
    })
    .catch( err => console.log(err) );
  }
}

exports.getTambahDaftarKeuangan = (req, res, next) => {
  res.render('admin/laporan/tambahdaftarkeuangan',{
    route: 'laporan',
    keuangan: null,
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