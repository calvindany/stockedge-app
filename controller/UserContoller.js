const Barang = require('../model/barang');
const User = require('../model/user');
const Transaksi = require('../model/transaction');

exports.getLanding = (req, res, next) => {
    let totalKeranjang = null;
    if(req.isLoggedIn){
        totalKeranjang = req.user.totalKeranjang;
    }
    Barang.find()
    .select('namabarang stok harga image')
    .then( barang => {
        res.render('user/landing', {
            barang: barang,
            isLoggedIn: req.isLoggedIn,
            totalKeranjang: totalKeranjang,
        });
    })
}

exports.getProduk = (req, res, next) => {
    let totalKeranjang = null;
    if(req.isLoggedIn){
        totalKeranjang = req.user.totalKeranjang;
    }
    Barang.find()
    .select('namabarang stok harga image')
    .then( barang => {
        // console.log(req.isLoggedIn)
        res.render('user/produk',{
            barang: barang,
            isLoggedIn: req.isLoggedIn,
            totalKeranjang: totalKeranjang,        
        })
    })
}

exports.postTambahProdukKeKeranjang = (req, res, next) => {
    // Mode Beli adalah pilihan user antara pesan atau tambah kekeranjang
    const {idbarang, jumlah, modeBeli} = req.body;
    User.findOne({ _id: req.user.iduser })
    .then( user => {
        Barang.findOne({ _id: idbarang })
        .then( barang => {
            if(user.keranjang.length <= 0) {
                user.keranjang = [{
                    idbarang: idbarang,
                    namabarang: barang.namabarang,
                    harga: parseInt(barang.harga),
                    jumlah: parseInt(jumlah),
                    subtotal: parseInt(jumlah) * barang.harga,
                }];
            } else {
                const isExist = user.keranjang.filter( barangDalamKeranjang => {
                    return barangDalamKeranjang.idbarang == idbarang;
                })
    
                if(isExist <= 0){
                    user.keranjang.push({
                        idbarang: idbarang,
                        namabarang: barang.namabarang,
                        harga: parseInt(barang.harga),
                        jumlah: parseInt(jumlah),
                        subtotal: parseInt(jumlah) * barang.harga,
                    })
                } else {
                    const index = user.keranjang.findIndex( barangDalamKeranjang => {
                        return barangDalamKeranjang.idbarang == idbarang;
                    });    
                    user.keranjang[index].jumlah += parseInt(jumlah);
                    user.keranjang[index].subtotal += parseInt(user.keranjang[index].jumlah) * parseInt(barang.harga);
                }
            }
            user.save();

            if(modeBeli == 'Pesan'){
                return res.redirect('/keranjang')
            } else {
                return res.redirect('/produk')
            }
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
}

exports.getKeranjang = (req, res, next) => {
    User.findOne({ _id: req.user.iduser })
    .then( user => {
        const totalBarang = user.keranjang.length;
        let totalPembelian = 0;

        let totalKeranjang = null;
        if(req.isLoggedIn){
            totalKeranjang = req.user.totalKeranjang;
        }

        user.keranjang.map( barangDalamKeranjang => {
            totalPembelian += barangDalamKeranjang.subtotal;
        })

        res.render('user/keranjang', {
            keranjang: user.keranjang,
            totalBarang: totalBarang,
            totalPembelian: totalPembelian,
            isLoggedIn: req.isLoggedIn,
            totalKeranjang: totalKeranjang,        
        });
    })
}

exports.postEditStokDalamKeranjang = (req, res, next) => {
    const idbarang = req.body.idbarang;
    const newJumlah = req.body.jumlah;

    User.findOne({ _id: req.user.iduser })
    .then( user => {
        let newKeranjang = [...user.keranjang];

        const index = newKeranjang.findIndex( barang => {
            return barang.idbarang == idbarang;
        })
        // console.log(newKeranjang[index])
        newKeranjang[index].jumlah = newJumlah;
        newKeranjang[index].subtotal = newKeranjang[index].harga * newJumlah;
    
        user.save();
        return res.redirect('/keranjang')
    });
}

exports.postHapusStokDalamKeranjang = (req, res, next) => {
    const idbarang = req.body.idbarang;

    User.findOne({ _id: req.user.iduser })
    .then( user => {
        let newKeranjang = [...user.keranjang];
    
        newKeranjang = newKeranjang.filter( barang => {
            return barang.idbarang != idbarang;
        })
        user.keranjang = newKeranjang;

        user.save();

        return res.redirect('/keranjang')
    })
}

exports.postPesanBarangDalamKeranjang = (req, res, next) => {
    const totalBelanja = req.body.totalBelanja;
    const date = new Date();
    const stringBuildDate = date.toISOString().split('T')[0];
    User.findOne({ _id: req.user.iduser })
    .then( user => {
        const transaksi = new Transaksi({
            namapembeli: user.username,
            tanggal: stringBuildDate,
            status: 'Belum Bayar',
            barang: user.keranjang,
            total: totalBelanja,
        })

        // Hapus semua data yang ada di keranjang user
        user.keranjang = [];
        user.save();
        return transaksi.hitungKeuntungan()
    })
    .then( () => {

        return res.redirect('/keranjang')
    })
}   