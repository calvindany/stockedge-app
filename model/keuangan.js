const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const daftarKeuanganSchema = new Schema(
  {
    idtransaksi: {
      type: String
    },
    tanggal: {
      type: String,
      require: true,
    },
    tipe: {
      type: String,
      require: true,
    },
    keterangan: {
      type: String,
      require: true,
    },
    nominal: {
      type: Number,
    },
    pendapatan: {
      type: Number,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { collection: "daftarkeuangan" }
);

module.exports = mongoose.model("daftarkeuangan", daftarKeuanganSchema);
