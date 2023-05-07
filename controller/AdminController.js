const barang = require("../model/barang");
const Barang = require("../model/barang");
const transaction = require("../model/transaction");
const Transaction = require("../model/transaction");

exports.getDashboard = (req, res, next) => {
  let isAdmin = false;
  if (req.admin) {
    isAdmin = true;
  }
  res.render("admin/dashboard", {
    route: "/dashboard",
    isAdmin: isAdmin,
  });
};

exports.getBarang = (req, res, next) => {
  Barang.find()
    .then((barang) => {
      res.render("admin/barang", {
        title: "Inventaris Barang",
        route: "/barang",
        barang: barang,
      });
    })
    .catch((err) => console.log(err));
};

exports.postBarang = (req, res, next) => {
  const namabarang = req.body.namabarang;
  const stok = req.body.stok;
  const harga = req.body.harga;
  const modal = req.body.modal;

  const newbarang = new Barang({
    namabarang: namabarang,
    stok: stok,
    harga: harga,
    modal: modal,
  });

  newbarang.save();

  return res.redirect("/barang");
};

exports.postEditBarang = (req, res, next) => {
  const idupdatedbarang = req.body.idupdatedbarang;
  const newnamabarang = req.body.newnamabarang;
  const newstok = req.body.newstok;
  const newharga = req.body.newharga;
  const newmodal = req.body.newmodal;

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
  res.render('admin/transaksi', {
    route: '/transaksi'
  });
}

exports.getTambahTransaksi = (req, res, next) => {
  Barang.find().then((barang) => {
    res.render("admin/tambahtransaksi", {
      route: "/transaksi/tambah",
      barang: barang,
      transaksi: null,
    });
  });
};

exports.postTambahTransaksi = (req, res, next) => {
  const namapembeli = req.body.namapembeli;
  const tanggal = req.body.tanggal;
  const idbarangpilihan = req.body.idbarang;
  const jumlah = req.body.jumlah;
  const harga = req.body.hargavalue;

  const newTransaction = new Transaction({
    namapembeli: namapembeli,
    tanggal: tanggal,
  });
  newTransaction.tambahBarang({ idbarangpilihan, jumlah, harga });

  return res.redirect("/transaksi/edit/" + newTransaction._id);
};

exports.getEditTransaksi = (req, res, next) => {
  const idtransaksi = req.params.idtransaksi;
  Transaction.findOne({ _id: idtransaksi }).then((transaksi) => {
    Barang.find().then((barang) => {
      res.render("admin/transaksi", {
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

  Transaction.findOne({ _id: idtransaksi })
    .then((transaksi) => {
      transaksi.namapembeli = namapembeli;
      transaksi.tanggal = tanggal;
      return transaksi.tambahBarang({ idbarangpilihan, jumlah, harga });
    })
    .then(() => {
      return res.redirect("/transaksi/edit/" + idtransaksi);
    });
};
