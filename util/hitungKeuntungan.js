/*
    Function ini adalah scheduler function, dimana hanya akan dijalankan
    pada jadwal yang sudah ditentukan di app.js / cron job

    Fungsi : Menghitung secara keseluruhan keuntungan dalam setiap
    bulan. Hasilnya akan disimpan di database collection admin.

    Data ini dibutuhkan untuk didisplay di grafik keuntungan
    di dashboard admin
*/

const Keuangan = require("../model/keuangan");
const RiwayatKeuangan = require("../model/riwayatKeuangan");
const month = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
'Juli', 'Agustus', 'November', 'Desember'
]

const hitungKeuntungan = () => {
    const date = new Date();
    const bulan = date.getMonth() - 1;
    let tahun;
    if( date.getMonth() == 0 ){
        tahun = date.getFullYear() - 1;
    } else {
        tahun = date.getFullYear();
    }

    let keuntungan = 0;
    Keuangan.find({ tanggal: { $gte: `01-${bulan}-${tahun}`, $lte: `31-${bulan}-${tahun}` } })
    .then (keuangan => {
        keuangan.map( keu => {
            keuntungan += parseInt(keu.pendapatan);
        })
        return RiwayatKeuangan.findOne({ tahun: tahun });
    })
    .then( riwayat => {
        if(riwayat){
            riwayat.bulan.push(
                {
                    namabulan: month[bulan],
                    keuntungan: keuntungan,
                }
            )
        } else {
            const newRiwayat = new RiwayatKeuangan({
                tahun: tahun,
                bulan: [
                    {
                        namabulan: month[bulan],
                        keuntungan: keuntungan,
                    }
                ]
            })
            return newRiwayat.save();
        }
        
        return riwayat.save();
    })
    .catch( err => console.log(err) );
}

module.exports = hitungKeuntungan