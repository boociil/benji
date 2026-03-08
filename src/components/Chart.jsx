import React, { useMemo } from "react";
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
  Legend
);

const Charts = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="py-4 text-gray-300">No data to display</div>;
  }

  const labels = useMemo(
    () => data.map((it) => it.nama ?? it.name ?? "—"),
    [data]
  );

  const jenis12 = useMemo(() => ({
    labels,
    datasets: [
      {
        label: "Pagi 1",
        data: data.map((it) => Number(it.jenis1 ?? 0)),
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        borderRadius: 10,
      },
      {
        label: "Pagi 2",
        data: data.map((it) => Number(it.jenis2 ?? 0)),
        backgroundColor: "rgba(255, 159, 64, 0.7)",
        borderRadius: 10,
      },
    ],
  }), [data, labels]);

  const jenis34 = useMemo(() => ({
    labels,
    datasets: [
      {
        label: "Sore",
        data: data.map((it) => Number(it.jenis3 ?? 0)),
        backgroundColor: "rgba(75, 192, 192, 0.7)",
        borderRadius: 10,
      },
      {
        label: "Bukti Dukung",
        data: data.map((it) => Number(it.jenis4 ?? 0)),
        backgroundColor: "rgba(153, 102, 255, 0.7)",
        borderRadius: 10,
      },
    ],
  }), [data, labels]);

  const options = {
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
        stacked: false,
        ticks: {
          color: "#000000",
          callback: function (value, index) {
            const label = this.getLabelForValue(value) ?? "";
            return label.length > 30 ? label.slice(0, 27) + "..." : label;
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.08)",
          drawBorder: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          color: "#000000",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.08)",
          drawBorder: false,
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-white shadow-md pb-14" style={{ height: 360 }}>
        <h3 className="text-lg font-semibold text-black mb-2">Pagi</h3>
        <Bar data={jenis12} options={options} />
      </div>

      <div className="p-4 rounded-2xl bg-white shadow-md pb-14" style={{ height: 360 }}>
        <h3 className="text-lg font-semibold text-black mb-2">Sore</h3>
        <Bar data={jenis34} options={options} />
      </div>
    </div>
  );
};

export default Charts;
