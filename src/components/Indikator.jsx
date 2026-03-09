import React, { use } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import ChartInd from "../components/ChartInd";
import excelLogo from "../assets/excel.png";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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

        // setSortedPagi(sortLeaderboardPagi(response.data.data));
        // setSortedSore(sortLeaderboardSore(response.data.data));
        setData(response.data.data);
      } catch (error) {
       
        // tangani error axios lebih spesifik
        if (error.response) {
          // server memberikan response (status code di luar 2xx)
          setErrorMsg(
            `Server error: ${error.response.status} ${error.response.statusText}`
          );
          
        } else if (error.request) {
          // request dibuat tapi tidak ada response (mungkin CORS atau network)
          setErrorMsg(
            "No response from server. Possible network or CORS issue."
          );
          
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
          Indeks : item.indikator,
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
  
      saveAs(file, "data_indeks_benji_" + bulan + "_" + tahun + ".xlsx");
    };

  const onDownloadClick = async () => {

    downloadExcel(data);
    
  };

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

export default Indikator;
