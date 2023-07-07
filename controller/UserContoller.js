const Barang = require('../model/barang');
const User = require('../model/user');
const Kategori = require('../model/kategori');
const Transaksi = require('../model/transaction');
const fileHelper = require('../util/fileDelete');

const sharp = require('sharp');
const path = require('path');
const fs = require('fs')

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
        .limit(4)
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
    let jumlahData = 0;

    let searchByKeyword = req.query.namabarang;
    let searchByCategori = req.query.kategori;
    let page = req.query.page;

    if(req.isLoggedIn){
        totalKeranjang = req.user.totalKeranjang;
    }

    if(messageSuccess.length > 0){
        message = messageSuccess[0];
    } else {
        message = null;
    }

    if(!page){
        page = 1;
    }

    if(searchByKeyword){
        let regexPattern = new RegExp(searchByKeyword, "i");
        // console.log(regexPattern);
        let properties = {}
        if(searchByKeyword == ''){
            properties = {}
        } else {
            properties = { namabarang: { $regex: regexPattern }}
        }
        Barang.find(properties)
        .then (barang => {
            jumlahData = barang.length;
            return Barang.find(properties)
            .select('namabarang stok harga image')
            .limit(8)
            .skip((page - 1) * 8)
        })
        .then( barang => {
            Kategori.find()
            .then( kategori => {
                return res.render('user/produk',{
                    barang: barang,
                    kategori: kategori,
                    banyakData: jumlahData,
                    isLoggedIn: req.isLoggedIn,
                    isAdmin: req.isAdmin,
                    totalKeranjang: totalKeranjang,  
                    message: message,      
                })
            })
        })
    } else if(searchByCategori) {
        let properties = {}
        if(searchByCategori == 'all'){
            properties = {}
        } else {
            properties = { kategori: searchByCategori }
        }
        Barang.find(properties)
        .then( barang => {
            jumlahData = barang.length;
            return Barang.find(properties)
            .select('namabarang stok harga image')
            .limit(8)
            .skip((page - 1) * 8)
        })
        .then( barang => {
            Kategori.find()
            .then( kategori => {
                return res.render('user/produk',{
                    barang: barang,
                    kategori: kategori,
                    banyakData: jumlahData,
                    isLoggedIn: req.isLoggedIn,
                    isAdmin: req.isAdmin,
                    totalKeranjang: totalKeranjang,  
                    message: message,      
                })
            })
        })
        
    } else {
        Barang.find()
        .then( barang => {
            jumlahData = barang.length
            
            return Barang.find()
            .select('namabarang stok harga image')
            .limit(8)
            .skip((page - 1) * 8)
        })
        .then( barang => {
            Kategori.find()
            .then( kategori => {
                // console.log(req.isLoggedIn)
                return res.render('user/produk',{
                    barang: barang,
                    kategori: kategori,
                    banyakData: jumlahData,
                    isLoggedIn: req.isLoggedIn,
                    isAdmin: req.isAdmin,
                    totalKeranjang: totalKeranjang,  
                    message: message,      
                })
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
                    // console.log(b._id, bk.idbarang)
                    return b._id == bk.idbarang;
                });
                // console.log(index)
                if(index > 0){
                    gambarBarangDalamKeranjang.push(barang[index].image);
                }
                // console.log(gambarBarangDalamKeranjang)
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
    const messageSuccess = req.flash('success');
    const messageFailed = req.flash('failed');
    let message = '';
    if(messageSuccess.length > 0){
        message = messageSuccess[0];
    } else if(messageFailed.length > 0){
        message = messageFailed[0];
    } else {
        message = null;
    }

    User.findOne({ _id: req.user.iduser })
    .then( user => {
        Transaksi.find({ iduser: user._id })
        .then( transaksi => {
            return res.render('user/invoice', {
                invoice: transaksi,
                isLoggedIn: req.isLoggedIn,
                isAdmin: req.isAdmin,
                totalKeranjang: req.user.totalKeranjang,
                message: message,
            });
        })
        .catch( err => console.log(err));
    })
    .catch(err => console.log(err));
}

exports.postBuktiPembayaran = (req, res, next) => {
    const idinvoice = req.body.idinvoice;

    if(req.file){
        Transaksi.findOne({ _id: idinvoice })
        .then( transaksi => {
            if(transaksi.buktibayar && fs.existsSync(path.join(__dirname, '../public/images/buktibayar/') + transaksi.buktibayar)){
                // Hapus gambar invoice kalau exist (buat jaga jaga aja)
                fileHelper.deleteFile(path.join(__dirname, '../public/images/buktibayar/') + transaksi.buktibayar)
            }

            let imageFileName = req.file.filename;

            transaksi.status = 'Menunggu Validasi';
            transaksi.buktibayar = 'invoice_' + imageFileName;
            sharp(path.join(__dirname, '../public/images/') + imageFileName)
            .resize(400, 400)
            .toFile(path.join(__dirname, '../public/images/buktibayar/') + 'invoice_' + imageFileName, (err, info) => {
                if(err) {
                    console.log(err);
                }

                //Hapus gambar sebelum di resize
                fileHelper.deleteFile(path.join(__dirname, '../public/images/') + imageFileName)
            });

            req.flash('success', 'Bukti pembayaran berhasil disimpan');
            transaksi.save();
            
            return res.redirect("/invoice");
        })
        .catch (err => {
            console.log(err)
            req.flash('failed', 'Bukti pembayaran gagal disimpan');
            return res.redirect('/invoice')
        })
    }
}