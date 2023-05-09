const ctx = document.getElementById("myChart");

const chart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [
      "Januari",
      "Febuary",
      "Maret",
      "April",
      "Juni",
      "July",
      "Agustus",
      "Oktober",
      "November",
      "Desember",
    ],
    datasets: [
      {
        label: "Tahun 2022",
        data: [100000, 20000, 100000, 200000, 80000, 100000],
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
