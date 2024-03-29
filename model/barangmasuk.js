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

const barangMasukSchema = new Schema(
  {
    namasupplier: {
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
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { collection: "barangmasuk" }
);

barangMasukSchema.methods.tambahBarang = function (selectedbarang) {
  let perbaruibarang = [...this.barang];
  return new Promise((resolve, reject) => {
    // console.log(selectedbarang);
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
        this.save();

        resolve(true);
      })
      .catch((err) => {
        console.log(err);
        reject(false);
      });
  });
};

barangMasukSchema.methods.hapusBarang = function (idbarang) {
  let barangtemp = [...this.barang];
  let indexDeletedBarang = barangtemp.findIndex((barang) => {
    return barang.idbarang == idbarang;
  });

  Barang.findOne({ _id: idbarang }).then((barang) => {
    barang.stok -= barangtemp[indexDeletedBarang].jumlah;
    barang.save();
  });

  let newbarang = barangtemp.filter((barang) => {
    return barang.idbarang != idbarang;
  });
  this.barang = newbarang;
  this.total = hitungtotal(this.barang);

  return this.save();
};

module.exports = mongoose.model("barangmasuk", barangMasukSchema);
