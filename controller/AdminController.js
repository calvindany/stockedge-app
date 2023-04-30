const Barang = require("../model/barang");

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

exports.getOrder = (req, res, next) => {
  Barang.find().then((barang) => {
    res.render("admin/order", {
      route: "/order",
      barang: barang,
    });
  });
};
