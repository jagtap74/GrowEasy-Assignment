"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [crmData, setCrmData] = useState<any[]>([]);
  const [skipped, setSkipped] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "https://groweasy-backend-l7fh.onrender.com/upload",
        formData
      );

      setRows(res.data.rows);
    } catch (error) {
      console.error(error);
      alert("Upload Failed");
    }
  };
  const importData = async () => {

    try {
      setLoading(true);

      const res = await axios.post(
        "https://groweasy-backend-l7fh.onrender.com/import",
        {
          rows,
        }
      );

      console.log("Response:", res.data);
      console.log("Imported:", res.data.imported);

      setCrmData(res.data.imported);
      setSkipped(res.data.skipped || []);

      const imported = res.data.imported || [];

      setCrmData(imported);
    } catch (err: any) {
      console.log(err);

      alert("Import Failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center py-10">

      <h1 className="text-5xl font-bold text-gray-800 mb-8">
        GrowEasy AI CSV Importer
      </h1>

      {/* Upload Card */}

      <div className="bg-white rounded-2xl shadow-xl p-8 w-[550px] flex flex-col items-center">

        <label className="cursor-pointer w-full border-2 border-dashed border-blue-400 rounded-xl p-8 flex flex-col items-center hover:bg-blue-50 transition">

          <div className="text-6xl">📄</div>

          <h2 className="text-2xl font-semibold mt-4">
            Choose CSV File
          </h2>

          <p className="text-gray-500 mt-2">
            Click to browse
          </p>

          {file && (
            <p className="mt-4 text-green-600 font-semibold">
              ✅ {file.name}
            </p>
          )}

          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                setFile(e.target.files[0]);
              }
            }}
          />
        </label>

        <button
          onClick={uploadFile}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition"
        >
          Upload & Preview
        </button>

      </div>

      {/* Preview */}

      {rows.length > 0 && (

        <div className="mt-10 w-11/12 max-w-7xl">

          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">

            <div className="flex justify-between items-center mb-6">

              <div>
                <h2 className="text-3xl font-bold">
                  CSV Preview
                </h2>

                <p className="text-gray-500 mt-1">
                  Ready to Import
                </p>
              </div>

              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
                {rows.length} Records
              </span>

            </div>

            {/* Stats */}

            <div className="grid grid-cols-3 gap-4 mb-6">

              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-gray-500 text-sm">
                  File
                </p>

                <p className="font-semibold">
                  {file?.name}
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-gray-500 text-sm">
                  Rows
                </p>

                <p className="font-semibold">
                  {rows.length}
                </p>
              </div>

              <div className="bg-yellow-50 rounded-xl p-4">
                <p className="text-gray-500 text-sm">
                  Status
                </p>

                <p className="font-semibold text-green-600">
                  Ready to Import
                </p>
              </div>

            </div>


            {/* Table */}

            <div className="overflow-x-auto overflow-y-auto max-h-[450px] rounded-xl border">

              <table className="min-w-full">

                <thead className="sticky top-0 bg-blue-600 text-white">

                  <tr>

                    {Object.keys(rows[0]).map((key) => (

                      <th
                        key={key}
                        className="px-5 py-3 text-center"
                      >
                        {key}
                      </th>

                    ))}

                  </tr>

                </thead>

                <tbody>

                  {rows.map((row, index) => (

                    <tr
                      key={index}
                      className="border-b hover:bg-gray-50 transition"
                    >

                      {Object.values(row).map((value: any, i) => (

                        <td
                          key={i}
                          className="px-5 py-3 text-center"
                        >
                          {value}
                        </td>

                      ))}

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            {/* Button */}

            <div className="flex justify-end mt-6">

              <button
                onClick={importData}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg"
              >
                {loading ? "Importing..." : "Confirm Import"}
              </button>

            </div>
          </div>

        </div>

      )}
      {crmData.length > 0 && (
        <div className="mt-10 w-11/12 max-w-7xl bg-white rounded-2xl shadow-xl border border-gray-200 p-6">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              AI Extracted CRM Records
            </h2>

            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full">
              {crmData.length} Imported
            </span>
            <div className="grid grid-cols-2 gap-4 mt-6 mb-6">

              <div className="bg-green-50 rounded-xl p-4 text-center">
                <p className="text-gray-500 text-sm">Imported</p>
                <p className="text-2xl font-bold text-green-600">
                  {crmData.length}
                </p>
              </div>

              <div className="bg-red-50 rounded-xl p-4 text-center">
                <p className="text-gray-500 text-sm">Skipped</p>
                <p className="text-2xl font-bold text-red-600">
                  {skipped.length}
                </p>
              </div>

            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border">

            <table className="min-w-full">

              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-center">Name</th>
                  <th className="px-4 py-3 text-center">Email</th>
                  <th className="px-4 py-3 text-center">Mobile</th>
                  <th className="px-4 py-3 text-center">City</th>
                  <th className="px-4 py-3 text-center">CRM Status</th>
                </tr>
              </thead>

              <tbody>
                {crmData.map((row: any, index: number) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 text-center">{row.name}</td>
                    <td className="px-4 py-3 text-center">{row.email}</td>
                    <td className="px-4 py-3 text-center">
                      {row.mobile_without_country_code}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {row.city}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {row.crm_status || "Not Available"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </main>
  );
}