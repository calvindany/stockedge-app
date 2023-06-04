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
      console.log(subtotal)
    document.getElementById("subtotal").value = subtotal;
  });
});

// Untuk merespon event jika checkbox pada form ischecked.
// Respon yang diberikan adalah field harga akan enabled
const checkboxedititem = document.getElementById("editnamabarang");
checkboxedititem.addEventListener("change", function () {
  if (checkboxedititem.checked) {
    document.getElementById("namabarang").disabled = false;
  } else {
    document.getElementById("namabarang").disabled = true;
  }
});