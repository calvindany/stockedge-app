// Untuk merespon event jika item pada tabel barang terselect (radio buttonnya)
// Respon yang diberikan adalah form (field nama barang) yang disebelah kiri akan terisi secara otomatis
const radiocheckeditem = document.querySelectorAll("#checkeditem");
radiocheckeditem.forEach((item) => {
  item.addEventListener("change", function () {
    let itemsplit = item.value.split(",");
    document.getElementById("idbarang").value = itemsplit[0];
    document.getElementById("namabarang").value = itemsplit[1];
    document.getElementById("hargafield").value = parseInt(itemsplit[2]);
    document.getElementById("hargavalue").value = parseInt(itemsplit[2]);
    // Respon ini akan mengubah field sub total dengan mengkalikannya dengan field jumlah.
    let subtotal =
      parseInt(document.getElementById("jumlah").value) *
      parseInt(document.getElementById("hargafield").value);
    document.getElementById("subtotal").value = subtotal;
  });
});

// Untuk merespon event jika checkbox pada form ischecked.
// Respon yang diberikan adalah field harga akan enabled
const checkboxedititem = document.getElementById("editharga");
checkboxedititem.addEventListener("change", function () {
  if (checkboxedititem.checked) {
    document.getElementById("hargafield").disabled = false;
  } else {
    document.getElementById("hargafield").disabled = true;
  }
});

// Untuk merespon event jika field jumlah (barang yang dibeli) atau field harga barang berubah (onchange)
// Respon yang diberikan adalah field jumlah akan dikalikan dengan field harga barang
// Untuk event jika harga barang yang berubah karena perubahan nilai yang di trigger dari select barang melalui radio button,
// ada pada line 3 - 16, digabung bersama event ketika radio button di select

const jumlahbarang = document.getElementById("jumlah");
const harga = document.getElementById("hargafield");

jumlahbarang.addEventListener("keyup", function () {
  let subtotal =
    parseInt(document.getElementById("jumlah").value) *
    parseInt(document.getElementById("hargafield").value);
  document.getElementById("subtotal").value = subtotal;
});

harga.addEventListener("keyup", function () {
  let subtotal =
    parseInt(document.getElementById("jumlah").value) *
    parseInt(document.getElementById("hargafield").value);
  document.getElementById("subtotal").value = subtotal;
});

// // Untuk merespon event jika button "Tambah" diklik
// // Respon yang diberikan adalah value nama barang, jumlah, dan subtotal akan disimpan dalam local storage
// const buttontambah = document.getElementById("buttontambah");
// buttontambah.addEventListener("click", function () {
//   // Mengambil data dari local storage dan mengubahnya menjadi Object javascript
//   let local = JSON.parse(localStorage.getItem("config"));
//   let item;

//   // Memeriksa apakah variable local (value local storage) memiliki nilai atau undifined.
//   if (local) {
//     // Jika memiliki nilai maka get item yang sudah masuk di local storage, kemudian push arraynya dengan data yang baru
//     item = local.item;
//     item.push({
//       namabarang: document.getElementById("namabarang").value,
//       jumlah: document.getElementById("jumlah").value,
//       harga: document.getElementById("hargafield").value,
//       subtotal: document.getElementById("subtotal").value,
//     });
//   } else {
//     // Jika tidak memiliki nilai, maka create item baru untuk nantinya dimasukan ke local storage sebagai item pertama
//     item = [
//       {
//         namabarang: document.getElementById("namabarang").value,
//         jumlah: document.getElementById("jumlah").value,
//         harga: document.getElementById("hargafield").value,
//         subtotal: document.getElementById("subtotal").value,
//       },
//     ];
//   }

//   // Membuat template data yang akan dimasukan dalam local storage yang nantinya akan diubah menjadi JSON format
//   const transaksi = {
//     namapembeli: document.getElementById("namapembeli").value,
//     tanggal: document.getElementById("tanggal").value,
//     item: item,
//   };

//   // Memasukan value transaksi ke local storage dengan indentifier "config". Sebelum memasukan perlu diubah terlebih
//   // dahulu ke JSON format
//   localStorage.setItem("config", JSON.stringify(transaksi));

//   // Mengambil ulang data config yang sudah terisi. Ini berfungsi untuk mengupdate variabel local.
//   local = JSON.parse(localStorage.getItem("config"));

//   document.getElementById("namapembeli").value = local.namapembeli;
//   document.getElementById("tanggal").value = local.tanggal;
//   document.getElementById("tabelbarangcart").innerHTML = "";
//   local.item.forEach((item) => {
//     document.getElementById("tabelbarangcart").innerHTML += `
//     <tr>
//       <td>${item.namabarang}</td>
//       <td>${item.jumlah}</td>
//       <td>${item.subtotal}</td>
//       <td>
//         <div class="form-check">
//           <input class="form-check-input" type="radio" id="checkeditem" value="${item.namabarang},${jumlah}"
//             name="idpilihanbarang">
//         </div>
//       </td>
//     </tr>
//     `;
//   });
// });

// // Untuk melakukan load pada tabel cart sesuai dengan data yang ada pada local storage. Ini akan terjadi ketika page pertama
// // kali diload
// window.onload = function () {
//   let local = JSON.parse(localStorage.getItem("config"));
//   if (local) {
//     document.getElementById("tabelbarangcart").innerHTML = "";
//     local.item.forEach((item) => {
//       document.getElementById("tabelbarangcart").innerHTML += `
//       <tr>
//         <td>${item.namabarang}</td>
//         <td>${item.jumlah}</td>
//         <td>${item.subtotal}</td>
//         <td>
//           <div class="form-check">
//             <input class="form-check-input" type="radio" id="checkeditem" value="${item.namabarang},${jumlah}"
//               name="idpilihanbarang">
//           </div>
//         </td>
//       </tr>
//       `;
//     });
//   }
// };
