import React, { use } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import ChartInd from "../components/ChartInd";

const Indikator = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const currentMonth = new Date().getMonth() + 1; // getMonth() is zero-based

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bulan, setBulan] = useState(currentMonth);
  const [errorMsg, setErrorMsg] = useState("");
  const [tahun, setTahun] = useState(2025);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let bulanString = "";
        if (bulan < 10) {
          bulanString = "0" + bulan;
        } else {
          bulanString = "" + bulan;
        }

        const response = await axios.post(
          apiUrl + "api/v1/indikator-benji",
          {
            tahun: tahun, // atau singkat: { tahun, bulan }
            bulan: bulanString,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-password": "katasore2025",
            },
            // timeout: 10000, // contoh: timeout 10 detik
          }
        );

        // console.log("raw response:", response);
        console.table("response.data:", response.data.data);

        // setSortedPagi(sortLeaderboardPagi(response.data.data));
        // setSortedSore(sortLeaderboardSore(response.data.data));
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        // tangani error axios lebih spesifik
        if (error.response) {
          // server memberikan response (status code di luar 2xx)
          setErrorMsg(
            `Server error: ${error.response.status} ${error.response.statusText}`
          );
          console.error("response data:", error.response.data);
        } else if (error.request) {
          // request dibuat tapi tidak ada response (mungkin CORS atau network)
          setErrorMsg(
            "No response from server. Possible network or CORS issue."
          );
          console.error("request:", error.request);
        } else {
          // error saat setup request
          setErrorMsg(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bulan, tahun]);

  const generateMonthOptions = () => {
    const monthNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    return monthNames.map((name, index) => {
      if (index + 1 === currentMonth) {
        return (
          <option key={index + 1} value={index + 1} selected>
            {name}
          </option>
        );
      } else {
        return (
          <option key={index + 1} value={index + 1}>
            {name}
          </option>
        );
      }
    });
  };

  return (
    <div className="mt-4 mb-10">
      <div className="flex gap-8 mb-4 bg-white w-fit p-4 rounded-xl shadow-lg">
        <div>
          <select name="bulan" id="" onChange={(e) => setBulan(e.target.value)}>
            {generateMonthOptions()}
          </select>
        </div>

        <div>
          <select name="tahun" id="" onChange={(e) => setTahun(e.target.value)}>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
          </select>
        </div>
      </div>
      <div className="flex-1 mb-4 p-4 bg-white rounded-xl font-semibold shadow-md text-center">
        {loading ? (
          <p>Loading data...</p>
        ) : (
          <ChartInd data={data} />
        )}
      </div>
    </div>
  );
};

export default Indikator;
