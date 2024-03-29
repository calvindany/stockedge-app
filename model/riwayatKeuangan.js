const mongoose = require("mongoose");
const Keuangan = require('../model/keuangan');

const Schema = mongoose.Schema;

const riwayatKeuanganSchema = new Schema({
    tahun: {
        type: String
    },
    bulan: [
        {
            namabulan: {
                type: Number,
            },
            keuntungan: {
                type: Number,
            },
        }
    ],
}, {collection: 'riwayatkeuangan' });

riwayatKeuanganSchema.methods.getKeuntunganHariIni = function (today){
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
    //   console.log(hariIni, hariKemarin)
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
      resolve(result);
    })
    .catch( err => {
      reject(err);
      console.log(err);
    })
  });
}
riwayatKeuanganSchema.methods.getKeluaranHariIni = function (today){
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
      resolve(result);
    })
    .catch( err => {
      reject(err);
      console.log(err);
    })
  });
}

module.exports = mongoose.model("riwayatkeuangan", riwayatKeuanganSchema);
