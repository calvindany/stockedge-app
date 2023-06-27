const Barang = require('../model/barang');

exports.getLanding = (req, res, next) => {
    res.render('user/landing');
}

exports.getProduk = (req, res, next) => {
    Barang.find()
    .select('namabarang stok harga image')
    .then( barang => {
        res.render('user/produk',{
            barang: barang,
        })
    })
}

exports.getKeranjang = (req, res, next) => {
    res.render('user/keranjang');
}