"use client";

import * as XLSX from "xlsx";
import { useState } from "react";

export default function ExcelUploader() {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);

      for (const sheetName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        console.log("Parsed:", sheetName, jsonData);

        await fetch("/api/excelUpload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sheet: sheetName, data: jsonData }),
        });
      }

      alert("Upload successful!");
    } catch (error) {
      console.error(error);
      alert("Upload failed.");
    }

    setUploading(false);
  };

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-lg font-bold mb-2">Upload Excel</h2>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleUpload}
        disabled={uploading}
        className="mb-2"
      />
      {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
    </div>
  );
}
