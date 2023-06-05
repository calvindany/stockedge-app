const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const kategoriSchema = new Schema(
  {
    kategori: {
      type: String,
      require: true,
    },
    image: {
      type: String,
    }
  },
  { collection: "kategori" }
);

module.exports = mongoose.model("kategori", kategoriSchema);
