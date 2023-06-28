const generateChart = (dataset) => {
  const ctx = document.getElementById("myChart");
  
  let data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  console.log(dataset)
  for(let i = 0; i < dataset.length; i++){
    data[dataset[i].namabulan] = parseInt(dataset[i].keuntungan)
  }
  
  const chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        "Januari",
        "Febuary",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "July",
        "Agustus",
        "Oktober",
        "November",
        "Desember",
      ],
      datasets: [
        {
          label: "Tahun 2023",
          data: data,
          borderWidth: 1,
          backgroundColor: "skyblue",
        },
      ],
    },
    options: {
      scales: {
        y: {
          ticks: {
            // color: "white",
          },
          beginAtZero: true,
        },
        // x: {
        //   ticks: {
        //     color: "white",
        //   },
        // },
      },
      plugins: {
        title: {
          display: true,
          text: "Pendapatan Pertahun",
          padding: {
            top: 10,
            bottom: 30,
          },
        },
      },
    },
  });
}
