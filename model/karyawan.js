const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const karyawanSchema = new Schema(
  {
    nomorktp: {
      type: String,
      require: true,
    },
    nama: {
      type: String,
      require: true,
    },
    alamat: {
      type: String,
      require: true,
    },
    gaji: {
      type: Number,
      require: true,
    },
    status: {
      type: String,
      require: true,
    },
    riwayatgaji: [
      {
        bulan: {
          type: String,
        },
        tahun: {
          type: String,
        },
      }
    ],
  },
  { collection: "karyawan" },
  {}
);

karyawanSchema.methods.cekGajiBulanIni = function () {
  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();

  // if(this.riwayatgaji.includes({bulan: month, tahun: year})){
  //   return true;
  // }

  const alreadypaid = this.riwayatgaji.filter( riwayatgaji => { return riwayatgaji.bulan == month && riwayatgaji.tahun == year });

  if(alreadypaid.length > 0){
    return true;
  }

  return false;
}

module.exports = mongoose.model("karyawan", karyawanSchema);
