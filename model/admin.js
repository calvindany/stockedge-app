const mongoose = require("mongoose");
const Transaksi = require('../model/transaction');

const Schema = mongoose.Schema;

const adminSchema = new Schema({
  username: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
});

// adminSchema.methods.getKeuntunganHariIni = function (date){
//   Transaksi.find({ tanggal: { $gte: date, $lt: date} })
// }

module.exports = mongoose.model("admin", adminSchema);
