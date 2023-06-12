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
      const persentasiKeuntungan = Math.floor((selisih / hariKemarin) * 100);

      result = {
        hariIni : hariIni, 
        hariKemarin: hariKemarin, 
        persentasi: persentasiKeuntungan
      }
      console.log(hariIni, ' ', hariKemarin);
      resolve(result);
    })
    .catch( err => {
      reject(err);
      console.log(err);
    })
  });
}

adminSchema.methods.getKeuntunganTahunIni = function (tahunIni){
  return new Promise((resolve, reject) => {
    let result = {};
    const tahunKemarin = new Date();
    tahunKemarin.setDate(tahunKemarin.getFullYear() - 1);

    const stringBuildTahunKemarin = `${tahunKemarin.toISOString().split('T')[0].split('-')[2]}-01-01`;
    const stringBuildTahunIni = `${tahunIni.toISOString().split('T')[0].split('-')[2]}-01-01`;

    Keuangan.find({ tanggal: { $gte: stringBuildTahunKemarin, $lte: stringBuildToday } }).select('tanggal tipe nominal')
    .then( keuangan => {
      let tahunIni = 0;
      let tahunKemarin = 0;

      keuangan.map( keuangan => {
        if(keuangan.tanggal >= stringBuildTahunKemarin && keuangan.tanggal < stringBuildTahunIni){
          if(keuangan.tipe == 'Masuk'){
            tahunKemarin += keuangan.nominal;
          } else {
            tahunKemarin -= keuangan.nominal;
          }
        } else {
          if(keuangan.tipe == 'Masuk'){
            tahunIni += keuangan.nominal;
          } else {
            tahunIni -= keuangan.nominal;
          }
        }
      })

      const selisih = tahunIni - tahunKemarin;
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
