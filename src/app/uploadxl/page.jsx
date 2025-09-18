"use client";

import { useState } from "react";
import * as XLSX from "xlsx";

export default function TestUploadPage() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setMessage("");

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });

      // Loop through each sheet in the Excel file
      for (const sheetName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        console.log(`Uploading sheet: ${sheetName}`, jsonData);

        const res = await fetch("/api/excelUpload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sheet: sheetName, data: jsonData }),
        });

        const result = await res.json();
        console.log("Response:", result);

        if (!res.ok) {
          throw new Error(result.error || "Upload failed");
        }
      }

      setMessage("✅ Upload successful!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Excel Upload Test</h1>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        disabled={uploading}
        className="mb-4"
      />
      {uploading && <p>Uploading...</p>}
      {message && <p>{message}</p>}
    </div>
  );
}
