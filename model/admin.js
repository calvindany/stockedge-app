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
  riwayatKeuangan: [
    {
      tahun: {
        type: String
      },
      bulan: [
        {
          namabulan: {
            type: String,
          },
          keuntungan: {
            type: Number,
          },
        }
      ]
    }
  ]
});

adminSchema.methods.getKeuntunganHariIni = function (today){
  return new Promise((resolve, reject) => {
    let result = {};
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const stringBuildYesterday = yesterday.toISOString().split('T')[0];
    const stringBuildToday = today.toISOString().split('T')[0];;

    Keuangan.find({ tanggal: { $gte: stringBuildYesterday, $lte: stringBuildToday }, tipe: 'Masuk' }).select('tanggal pendapatan')
    .then( keuangan => {
      let hariIni = 0;
      let hariKemarin = 0;

      keuangan.map( keuangan => {
        if(keuangan.tanggal >= stringBuildYesterday && keuangan.tanggal < stringBuildToday){
          hariKemarin += parseInt(keuangan.pendapatan);
        } else {
          hariIni += parseInt(keuangan.pendapatan);
        }
      })

      const selisih = hariIni - hariKemarin;
      console.log(hariIni, hariKemarin)
      let persentasiKeuntungan;
      if( hariKemarin == 0 || Math.floor((selisih / hariKemarin) * 100) >= 100){
        persentasiKeuntungan = 100;
      } else {
        persentasiKeuntungan = Math.floor((selisih / hariKemarin) * 100);
      }

      result = {
        hariIni : hariIni, 
        hariKemarin: hariKemarin, 
        persentasi: persentasiKeuntungan
      }
      // console.log(stringBuildToday, hariIni, ' ', stringBuildYesterday, hariKemarin);
      resolve(result);
    })
    .catch( err => {
      reject(err);
      console.log(err);
    })
  });
}
adminSchema.methods.getKeluaranHariIni = function (today){
  return new Promise((resolve, reject) => {
    let result = {};
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const stringBuildYesterday = yesterday.toISOString().split('T')[0];
    const stringBuildToday = today.toISOString().split('T')[0];;

    Keuangan.find({ tanggal: { $gte: stringBuildYesterday, $lte: stringBuildToday }, tipe: 'Keluar' }).select('tanggal nominal')
    .then( keuangan => {
      let hariIni = 0;
      let hariKemarin = 0;

      keuangan.map( keuangan => {
        if(keuangan.tanggal >= stringBuildYesterday && keuangan.tanggal < stringBuildToday){
          hariKemarin += keuangan.nominal;
        } else {
          hariIni += keuangan.nominal;
        }
      })

      const selisih = hariIni - hariKemarin;
      let persentasiKeluaran;
      if( hariKemarin == 0 || Math.floor((selisih / hariKemarin) * 100) >= 100){
        persentasiKeluaran = 100;
      } else {
        persentasiKeluaran = Math.floor((selisih / hariKemarin) * 100);
      }

      result = {
        hariIni : hariIni, 
        hariKemarin: hariKemarin, 
        persentasi: persentasiKeluaran
      }
      // console.log(stringBuildToday, hariIni, ' ', stringBuildYesterday, hariKemarin);
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
