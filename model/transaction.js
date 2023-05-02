const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Barang = require("./barang");
const barang = require("./barang");

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
  },
  { collection: "transaksi" }
);

transaksiSchema.methods.tambahBarang = function (selectedbarang) {
  let perbaruibarang = [...this.barang];

  Barang.findOne({ _id: selectedbarang.idbarangpilihan }).then((barang) => {
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

    this.total = 0;

    for (let i = 0; i < perbaruibarang.length; i++) {
      this.total += perbaruibarang[i].subtotal;
    }

    this.barang = perbaruibarang;
    this.save();
  });
};

module.exports = mongoose.model("transaksi", transaksiSchema);
