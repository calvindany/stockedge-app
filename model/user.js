const mongoose = require("mongoose");
const Keuangan = require('../model/keuangan');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    require: true,
  },
  keranjang: [
    {
      idbarang: {
        type: String,
      },
      namabarang: {
        type: String,
      },
      harga: {
        type: Number,
      },
      jumlah: {
        type: Number,
      },
      subtotal: {
        type: Number,
      }
    }
  ]
}, {collection: 'user'});

module.exports = mongoose.model("user", userSchema);
