const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Barang = require("./barang");

const hitungtotal = (barang) => {
  let total = 0;
  barang.forEach((barang) => {
    total += barang.subtotal;
  });

  return total;
};

const transaksiSchema = new Schema(
  {
    namapembeli: {
      type: String,
      require: true,
    },
    tanggal: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      require: true,
    },
    barang: [
      {
        idbarang: {
          type: String,
        },
        namabarang: {
          type: String,
        },
        jumlah: {
          type: Number,
        },
        harga: {
          type: Number,
        },
        subtotal: {
          type: Number,
        },
      },
    ],
    total: {
      type: Number,
    },
    pendapatan: {
      type: Number,
    },
  },
  { collection: "transaksi" }
);

transaksiSchema.methods.tambahBarang = function (selectedbarang) {
  let perbaruibarang = [...this.barang];

  return new Promise((resolve, reject) => {
    Barang.findOne({ _id: selectedbarang.idbarangpilihan })
      .then((barang) => {
        const isExisted = perbaruibarang.filter((barang) => {
          barang === selectedbarang.idbarangpilihan;
        });

        if (isExisted < 1) {
          perbaruibarang.push({
            idbarang: barang._id,
            namabarang: barang.namabarang,
            jumlah: selectedbarang.jumlah,
            harga: selectedbarang.harga,
            subtotal:
              parseInt(selectedbarang.jumlah) * parseInt(selectedbarang.harga),
          });
        } else {
          const index = perbaruibarang.findIndex({ idbarang: barang._id });
          perbaruibarang[index].jumlah += selectedbarang.jumlah;
          perbaruibarang[index].harga = selectedbarang.harga;
          perbaruibarang[index].subtotal =
            parseInt(selectedbarang.jumlah) * parseInt(selectedbarang.harga);
        }

        this.barang = perbaruibarang;
        this.total = hitungtotal(this.barang);
        
        resolve(true)
      })
      .catch((err) => {
        reject(err);
        console.log(err);
      });
  })
};

transaksiSchema.methods.hapusBarang = function (idbarang) {
  let barangtemp = [...this.barang];

  let newbarang = barangtemp.filter((barang) => {
    return barang._id != idbarang;
  });

  this.barang = newbarang;
  this.total = hitungtotal(this.barang);

  return this.save();
};

transaksiSchema.methods.hitungKeuntungan = function () {
  return new Promise((resolve, reject) => {
    let barangtemp = [...this.barang];
    
    Barang.find().select(' modal ')
    .then( barang => { 
      console.log(barang);
      let totalPendapatan = 0;
      barangtemp.map( barangYangDibeli => { 
        const findBarang = [...barang].filter( (barang1) => {
          return barangYangDibeli.idbarang == barang1._id;
        })
        console.log(findBarang);
        if(findBarang.length > 0){
          totalPendapatan += (barangYangDibeli.harga - findBarang[0].modal) * barangYangDibeli.jumlah;
        }
      })
      this.pendapatan = totalPendapatan;
      
      this.save();
      resolve(true)
    })
    .catch( err => {
      reject(err);
      console.log(err);
    }); 
  });
}

module.exports = mongoose.model("transaksi", transaksiSchema);
