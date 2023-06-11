const mongoose = require("mongoose");
const Keuangan = require('../model/keuangan');

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

adminSchema.methods.getKeuntunganHariIni = function (today){
  return new Promise((resolve, reject) => {
    let result = {};
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const stringBuildYesterday = yesterday.toISOString().split('T')[0];
    const stringBuildToday = today.toISOString().split('T')[0];;

    Keuangan.find({ tanggal: { $gte: stringBuildYesterday, $lte: stringBuildToday } }).select('tanggal tipe nominal')
    .then( keuangan => {
      let hariIni = 0;
      let hariKemarin = 0;

      keuangan.map( keuangan => {
        if(keuangan.tanggal >= stringBuildYesterday && keuangan.tanggal < stringBuildToday){
          if(keuangan.tipe == 'Masuk'){
            hariKemarin += keuangan.nominal;
          } else {
            hariKemarin -= keuangan.nominal;
          }
        } else {
          if(keuangan.tipe == 'Masuk'){
            hariIni += keuangan.nominal;
          } else {
            hariIni -= keuangan.nominal;
          }
        }
      })

      const selisih = hariIni - hariKemarin;
      const persentasiKeuntungan = (selisih / hariKemarin) * 100;

      result = {
        hariIni : hariIni, 
        hariKemarin: hariKemarin, 
        persentasi: persentasiKeuntungan
      }

      resolve(result);
    })
    .catch( err => {
      reject(err);
      console.log(err);
    })
  });
}

adminSchema.methods.getKeuntunganTahunIni = function (today){
  return new Promise((resolve, reject) => {
    let result = {};
    const yesterday = new Date();
    yesterday.setDate(yesterday.getFullYear() - 1);

    const stringBuildYesterday = yesterday.toISOString().split('T')[0];
    const stringBuildToday = today.toISOString().split('T')[0];;

    Keuangan.find({ tanggal: { $gte: stringBuildYesterday, $lte: stringBuildToday } }).select('tanggal tipe nominal')
    .then( keuangan => {
      let hariIni = 0;
      let hariKemarin = 0;

      keuangan.map( keuangan => {
        if(keuangan.tanggal >= stringBuildYesterday && keuangan.tanggal < stringBuildToday){
          if(keuangan.tipe == 'Masuk'){
            hariKemarin += keuangan.nominal;
          } else {
            hariKemarin -= keuangan.nominal;
          }
        } else {
          if(keuangan.tipe == 'Masuk'){
            hariIni += keuangan.nominal;
          } else {
            hariIni -= keuangan.nominal;
          }
        }
      })

      const selisih = hariIni - hariKemarin;
      const persentasiKeuntungan = (selisih / hariKemarin) * 100;

      result = {
        hariIni : hariIni, 
        hariKemarin: hariKemarin, 
        persentasi: persentasiKeuntungan
      }

      resolve(result);
    })
    .catch( err => {
      reject(err);
      console.log(err);
    })
  });
}

module.exports = mongoose.model("admin", adminSchema);
