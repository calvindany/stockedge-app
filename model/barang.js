const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const barangSchema = new Schema(
  {
    namabarang: {
      type: String,
      require: true,
    },
    kategori: {
      type: String,
      require: true,
    },
    stok: {
      type: Number,
      require: true,
    },
    harga: {
      type: Number,
      require: true,
    },
    modal: {
      type: Number,
      require: true,
    },
    image: {
      type: String,
    }
  },
  { collection: "barang" }
);

module.exports = mongoose.model("barang", barangSchema);
