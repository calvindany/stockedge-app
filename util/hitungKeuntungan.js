/*
    Function ini adalah scheduler function, dimana hanya akan dijalankan
    pada jadwal yang sudah ditentukan di app.js / cron job

    Fungsi : Menghitung secara keseluruhan keuntungan dalam setiap
    bulan. Hasilnya akan disimpan di database collection admin.

    Data ini dibutuhkan untuk didisplay di grafik keuntungan
    di dashboard admin
*/

const Keuangan = require("../model/keuangan");
const Admin = require("../model/admin");

const hitungKeuntungan = () => {
    const date = new Date();
    const bulan = date.getMonth() - 1;
    let tahun;
    if( date.getMonth() == 0 ){
        tahun = date.getFullYear() - 1;
    } else {
        tahun = date.getFullYear();
    }

    Keuangan.find({ tanggal: { $gte: `01-${bulan}-${tahun}`, $lte: `31-${bulan}-${tahun}` } })
    .then (keuangan => {
        Admin.findOne({ _id: '646462085f335228b519600b' })
        .then( admin => {
            const getIndexOfCurrentYear = admin.riwayatKeuangan.findIndex(( riyawat ) => {
                riwayat.tahun === tahun
            })

            if(getIndexOfCurrentYear == -1){
                admin.riwayatKeuangan.push(
                    {
                        tahun: tahun,
                        bulan: [
                            {
                                namabulan: {
                                    
                                }
                            }
                        ]
                    }
                )
            }
        })
    })
}

module.exports = hitungKeuntungan