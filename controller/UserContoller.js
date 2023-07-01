const Barang = require('../model/barang');
const User = require('../model/user');
const Kategori = require('../model/kategori');
const Transaksi = require('../model/transaction');

exports.getLanding = (req, res, next) => {
    let totalKeranjang = null;
    let messageSuccess = req.flash('status-send-to-cart');
    let message = ''; // Variabel ini yang akan dikirim ke depan untuk notif
    // console.log(req.isLoggedIn)
    // console.log(req.isAdmin)
    if(req.isLoggedIn){
        totalKeranjang = req.user.totalKeranjang;
    }

    if(messageSuccess.length > 0){
        message = messageSuccess[0];
    } else {
        message = null;
    }
    Kategori.find()
    .then( kategori => {
        Barang.find()
        .select('namabarang stok harga image')
        .then( barang => {
            res.render('user/landing', {
                barang: barang,
                kategori: kategori,
                isLoggedIn: req.isLoggedIn,
                isAdmin: req.isAdmin,
                totalKeranjang: totalKeranjang,
                message: message,      
            });
        })
        .catch( err => console.log(err));
    })
    .catch(err => console.log(err));
}

exports.getProduk = (req, res, next) => {
    let totalKeranjang = null;
    let messageSuccess = req.flash('status-send-to-cart');
    let message = ''; // Variabel ini yang akan dikirim ke depan untuk notif
    let search = req.query.namabarang;

    if(req.isLoggedIn){
        totalKeranjang = req.user.totalKeranjang;
    }

    if(messageSuccess.length > 0){
        message = messageSuccess[0];
    } else {
        message = null;
    }
    
    if(search){
        let regexPattern = new RegExp(search, "i");
        // console.log(regexPattern);
        Barang.find({namabarang: { $regex: regexPattern }})
        .select('namabarang stok harga image')
        .then( barang => {
            // console.log(barang)
            return res.render('user/produk',{
                barang: barang,
                isLoggedIn: req.isLoggedIn,
                isAdmin: req.isAdmin,
                totalKeranjang: totalKeranjang,  
                message: message,      
            })
        })
    } else {
        Barang.find()
        .select('namabarang stok harga image')
        .then( barang => {
            // console.log(req.isLoggedIn)
            return res.render('user/produk',{
                barang: barang,
                isLoggedIn: req.isLoggedIn,
                isAdmin: req.isAdmin,
                totalKeranjang: totalKeranjang,  
                message: message,      
            })
        })
    }
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
                req.flash('status-send-to-cart', 'Item berhasil ditambahkan di cart');
                return res.redirect('/keranjang')
            } else {
                req.flash('status-send-to-cart', 'Item berhasil ditambahkan di cart');
                return res.redirect('/produk')
            }
        })
        .catch(err => {
            console.log(err)
            req.flash('status-send-to-cart', 'Item gagal ditambahkan di cart');
            return res.redirect('/produk')
        });
    })
    .catch(err => {
        console.log(err);
        req.flash('status-send-to-cart', 'Item gagal ditambahkan di cart');
        return res.redirect('/produk')
    });
}

exports.getKeranjang = (req, res, next) => {
    /* 
    Notes :
    1. bk akronim dari barang keranjang
    2. b akronim dari barang
    */

    let messageSuccess = req.flash('status-send-to-cart');
    let message = ''; // Variabel ini yang akan dikirim ke depan untuk notif

    if(messageSuccess.length > 0){
        message = messageSuccess[0];
    } else {
        message = null;
    }

    User.findOne({ _id: req.user.iduser })
    .then( user => {
        const totalBarang = user.keranjang.length;
        let totalPembelian = 0;
        let gambarBarangDalamKeranjang = [];

        let totalKeranjang = null;
        if(req.isLoggedIn){
            totalKeranjang = req.user.totalKeranjang;
        }

        user.keranjang.map( bk => {
            totalPembelian += bk.subtotal;
        })

        Barang.find()
        .select('_id image')
        .then(barang => {
            // Statement ini akan mengambil nama file image dari collection barang
            // dan menyimpannya di array barangDalamKeranjang.
            user.keranjang.map( bk => {
                let index = barang.findIndex( b => {
                    return b._id == bk.idbarang;
                });

                gambarBarangDalamKeranjang.push(barang[index].image);
            })

            res.render('user/keranjang', {
                keranjang: user.keranjang,
                gambarBarang: gambarBarangDalamKeranjang,
                totalBarang: totalBarang,
                totalPembelian: totalPembelian,
                isLoggedIn: req.isLoggedIn,
                isAdmin: req.isAdmin,
                totalKeranjang: totalKeranjang,   
                message: message,
            });
        })
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
            iduser: user._id,
            namapembeli: user.username,
            tanggal: stringBuildDate,
            status: 'Belum Bayar',
            barang: user.keranjang,
            total: totalBelanja,
        });

        // Hapus semua data yang ada di keranjang user
        user.keranjang = [];
        user.save();
        return transaksi.hitungKeuntungan()
    })
    .then( () => {
        return res.redirect('/keranjang')
    })
}   

exports.getInvoice = (req, res, next) => {
    User.findOne({ _id: req.user.iduser })
    .then( user => {
        Transaksi.find({ iduser: user._id })
        .then( transaksi => {
            return res.render('user/invoice', {
                invoice: transaksi,
                isLoggedIn: req.isLoggedIn,
                isAdmin: req.isAdmin,
                totalKeranjang: req.user.totalKeranjang,
            });
        })
        .catch( err => console.log(err));
    })
    .catch(err => console.log(err));
}

exports.postBuktiPembayaran = (req, res, next) => {
    const idinvoice = req.body.idinvoice;

    if(req.file){
        Transaksi.findOne({_id: idinvoice })
        .then( transaksi => {
            transaksi.buktiBayar = req.file.filename;
            sharp(path.join(__dirname, '../public/images/') + transaksi.buktiBayar)
            .resize(400, 400)
            .toFile(path.join(__dirname, '../public/images/buktibayar') + 'invoice_' + transaksi.buktiBayar, (err, info) => {
                if(err) {
                    console.log(err);
                }

                //Hapus gambar sebelum di resize
                fileHelper.deleteFile(path.join(__dirname, '../public/images/') + transaksi.buktiBayar)
            });

            req.flash('success', 'Barang berhasil disimpan');
            transaksi.save();

            return res.redirect("/invoice");
        })
        .catch (err => {
            console.log(err)
            return res.redirect('/invoice')
        })
    }
}