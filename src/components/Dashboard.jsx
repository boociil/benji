import React, { use } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Chart from "../components/Chart";
import excelLogo from "../assets/excel.png";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Dashboard = () => {

  const apiUrl = import.meta.env.VITE_API_URL;

  const [data, setData] = useState(null);
  const [tahun, setTahun] = useState(2025);
  const [sortedPagi, setSortedPagi] = useState([]);
  const [sortedSore, setSortedSore] = useState([]);

  // mengambil bulan sekarang
  const currentMonth = new Date().getMonth() + 1; // getMonth() is zero-based

  const [bulan, setBulan] = useState(currentMonth);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // 🔹 Sort untuk Leaderboard Pagi (jenis1 + jenis2)
  const sortLeaderboardPagi = (data) => {
    if (!Array.isArray(data)) return [];
    return [...data].sort((a, b) => {
      const totalA = (a.jenis1 ?? 0) + (a.jenis2 ?? 0);
      const totalB = (b.jenis1 ?? 0) + (b.jenis2 ?? 0);
      return totalB - totalA; // urut dari terbesar ke terkecil
    });
  };

  // 🔹 Sort untuk Leaderboard Sore (jenis3 + jenis4)
  const sortLeaderboardSore = (data) => {
    if (!Array.isArray(data)) return [];
    return [...data].sort((a, b) => {
      const totalA = (a.jenis3 ?? 0) + (a.jenis4 ?? 0);
      const totalB = (b.jenis3 ?? 0) + (b.jenis4 ?? 0);
      return totalB - totalA;
    });
  };

  const downloadExcel = (data) => {

    const worksheetData = data.map((item, index) => {
      const date = new Date(item.tanggal);

      const formattedDate = date.toLocaleString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });

      return {
        No: index + 1,
        Nama: item.nama,
        Jenis: item.jenis,
        Tanggal: formattedDate
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Eval");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    saveAs(file, "data_eval_siakip_" + bulan + "_" + tahun + ".xlsx");
  };

  const onDownloadClick = async () => {

    let bulanString = "";
        if (bulan < 10) {
          bulanString = "0" + bulan;
        } else {
          bulanString = "" + bulan;
        }

    const dataDownload = await axios.post(
      apiUrl + "api/v1/export-excel",
      {
        tahun: tahun, // atau singkat: { tahun, bulan }
        bulan: bulanString,
      } ,
      { 
      headers: {
        "Content-Type": "application/json",
        "x-password": "katasore2025",
      }
      }
    );  

    // console.log(dataDownload.data.data);
    downloadExcel(dataDownload.data.data);
    
  };

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
          apiUrl + "api/v1/rekap-eval-siakip",
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
        setSortedPagi(sortLeaderboardPagi(response.data.data));
        setSortedSore(sortLeaderboardSore(response.data.data));
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

      {loading && <p>Loading data...</p>}

      {!loading && data && (
        <>
          <div className="md:flex md:gap-4 mb-4 w-full">
            <div className="flex-1 mb-4 p-4 bg-white rounded-xl font-semibold shadow-md text-center">
              {/* Leaderboard Pagi */}
              {sortedPagi && (
                <div className="grid grid-cols-[0.5fr_2fr_1fr_1fr]">
                  <div className="mt-2 border-y-1 border-gray-300 py-2 font-semibold text-sm">No.</div>
                  <div className="mt-2 border-y-1 border-gray-300 py-2 font-semibold text-sm">Nama</div>
                  <div className="mt-2 border-y-1 border-gray-300 py-2 font-semibold text-sm">Pagi1</div>
                  <div className="mt-2 border-y-1 border-gray-300 py-2 font-semibold text-sm">Pagi2</div>
                  {sortedPagi.slice(0, 5).map((item, index) => (
                    <>
                      <div className="mt-2 font-normal text-sm">
                        {index + 1}.
                      </div>
                      <div className="mt-2 font-normal text-sm text-left">
                        {item.nama}
                      </div>
                      <div className="mt-2 font-normal text-sm">
                        {item.jenis1 ?? 0}
                      </div>
                      <div className="mt-2 font-normal text-sm">
                        {item.jenis2 ?? 0}
                      </div>
                    </>
                  ))}
                </div>
              )}
            </div>
            <div className="flex-1 mb-4 p-4 bg-white rounded-xl font-semibold shadow-md text-center">
              {/* Leaderboard Sore */}
              {sortedSore && (
                <div className="grid grid-cols-[0.5fr_2fr_1fr_1fr]">
                  <div className="mt-2 border-y-1 border-gray-300 py-2 font-semibold text-sm">No.</div>
                  <div className="mt-2 border-y-1 border-gray-300 py-2 font-semibold text-sm">Nama</div>
                  <div className="mt-2 border-y-1 border-gray-300 py-2 font-semibold text-sm">Sore</div>
                  <div className="mt-2 border-y-1 border-gray-300 py-2 font-semibold text-sm">Bukti</div>
                  {sortedSore.slice(0, 5).map((item, index) => (
                    <>
                      <div className="mt-2 font-normal text-sm">
                        {index + 1}.
                      </div>
                      <div className="mt-2 font-normal text-sm text-left">
                        {item.nama}
                      </div>
                      <div className="mt-2 font-normal text-sm">
                        {item.jenis3 ?? 0}
                      </div>
                      <div className="mt-2 font-normal text-sm">
                        {item.jenis4 ?? 0}
                      </div>
                    </>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="hidden md:block">
            <Chart data={data} />
          </div>
        </>
      )}

      {/* Download Button */}
      {!loading && (
        <>
          <div className="flex gap-8 mt-4 w-fit py-1 rounded-xl ">  
            Download
          </div>

          <div className="flex gap-8 mb-4 bg-white w-fit py-1 rounded-xl shadow-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200" onClick={onDownloadClick}>
            <img src={excelLogo} alt="Excel Logo" className="w-12"/>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
