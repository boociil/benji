import React, { useMemo } from "react";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const Charts = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="py-4 text-gray-300">No data to display</div>;
  }

  // label = nama pegawai
  const labels = useMemo(
    () => data.map((it) => it.nama ?? "—"),
    [data]
  );

  // value = indikator
  const values = useMemo(
    () => data.map((it) => Number(it.indikator ?? 0)),
    [data]
  );

  const getColor = (value) => {
    if (value == 100) return "rgba(54, 162, 235, 0.7)"; // hijau
    if (value == 99) return "rgba(234,179,8,0.8)"; // kuning
    return "rgba(239,68,68,0.8)"; 
  };

  const dataMemo = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Indeks",
          data: values,
          backgroundColor:  values.map((v) => getColor(v)),
          borderRadius: 10,
          barThickness: 25,
        },
      ],
    }),
    [labels, values]
  );

  const options = {
    indexAxis: "y", // horizontal bar
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#000000",
        },
      },
      title: {
        display: false,
      },
      datalabels: {
        color: "#000",
        anchor: "middle",
        align: "right",
        font: {
          weight: "bold",
        },
        formatter: (value) => value
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(0,0,0,0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: "#000000",
        },
        grid: {
          color: "rgba(0,0,0,0.05)",
          drawBorder: false,
        },
      },
      y: {
        ticks: {
          color: "#000000",
          callback: function (value) {
            const label = this.getLabelForValue(value);
            return label.length > 30 ? label.slice(0, 27) + "..." : label;
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      <div
  className="p-4 pb-14"
  style={{ height: data.length * 45 }}
>
        <h3 className="text-lg font-semibold text-black mb-2">
          Indeks Benji
        </h3>
        <Bar data={dataMemo} options={options} />
      </div>
    </div>
  );
};

export default Charts;