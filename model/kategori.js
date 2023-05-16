const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const kategoriSchema = new Schema(
  {
    kategori: {
      type: String,
      require: true,
    },
  },
  { collection: "barang" }
);

module.exports = mongoose.model("barang", kategoriSchema);
