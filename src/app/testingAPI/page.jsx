"use client";

import { useState } from "react";

export default function APITestPage() {
  const [entity, setEntity] = useState("schools");
  const [operation, setOperation] = useState("GET");
  const [schoolId, setSchoolId] = useState("");
  const [classId, setClassId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [payload, setPayload] = useState("{}");
  const [response, setResponse] = useState("");

  const baseUrl = "/api";

  const handleTest = async () => {
    try {
      let url = "";
      const options = { method: operation, headers: { "Content-Type": "application/json" } };

      // Build API URL based on entity and IDs
      switch (entity) {
        case "schools":
          url = schoolId ? `${baseUrl}/schools/${schoolId}` : `${baseUrl}/schools`;
          break;
        case "classes":
          if (!schoolId) return alert("Enter School ID");
          url = classId
            ? `${baseUrl}/schools/${schoolId}/classes/${classId}`
            : `${baseUrl}/schools/${schoolId}/classes`;
          break;
        case "students":
          if (!schoolId) return alert("Enter School ID");
          url = studentId
            ? `${baseUrl}/schools/${schoolId}/students/${studentId}`
            : `${baseUrl}/schools/${schoolId}/students`;
          break;
        case "teachers":
          if (!schoolId) return alert("Enter School ID");
          url = teacherId
            ? `${baseUrl}/schools/${schoolId}/teachers/${teacherId}`
            : `${baseUrl}/schools/${schoolId}/teachers`;
          break;
        case "attendance":
          if (!schoolId) return alert("Enter School ID");
          if (!classId) return alert("Enter Class ID for attendance");
          url = `${baseUrl}/schools/${schoolId}/attendance/${classId}`;
          break;
        default:
          return;
      }

      // Add body for POST or PATCH
      if (operation === "POST" || operation === "PATCH") {
        options.body = payload;
      }

      const res = await fetch(url, options);
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setResponse("Error: " + err.message);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">API Testing Page</h1>

      {/* Entity & Operation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label>Entity:</label>
          <select value={entity} onChange={e => setEntity(e.target.value)} className="w-full border p-2 rounded">
            <option value="schools">Schools</option>
            <option value="classes">Classes</option>
            <option value="students">Students</option>
            <option value="teachers">Teachers</option>
            <option value="attendance">Attendance</option>
          </select>
        </div>

        <div>
          <label>Operation:</label>
          <select value={operation} onChange={e => setOperation(e.target.value)} className="w-full border p-2 rounded">
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PATCH">PATCH</option>
          </select>
        </div>

        <div>
          <label>School ID:</label>
          <input type="text" value={schoolId} onChange={e => setSchoolId(e.target.value)} className="w-full border p-2 rounded" placeholder="Leave empty for all" />
        </div>
      </div>

      {/* IDs for Classes, Students, Teachers */}
      {(entity === "classes" || entity === "students" || entity === "teachers" || entity === "attendance") && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {entity === "classes" && <div>
            <label>Class ID (optional for single):</label>
            <input type="text" value={classId} onChange={e => setClassId(e.target.value)} className="w-full border p-2 rounded" />
          </div>}

          {entity === "students" && <div>
            <label>Student ID (optional for single):</label>
            <input type="text" value={studentId} onChange={e => setStudentId(e.target.value)} className="w-full border p-2 rounded" />
          </div>}

          {entity === "teachers" && <div>
            <label>Teacher ID (optional for single):</label>
            <input type="text" value={teacherId} onChange={e => setTeacherId(e.target.value)} className="w-full border p-2 rounded" />
          </div>}

          {entity === "attendance" && <div>
            <label>Class ID (optional filter):</label>
            <input type="text" value={classId} onChange={e => setClassId(e.target.value)} className="w-full border p-2 rounded" />
          </div>}
        </div>
      )}

      {/* JSON Payload */}
      {(operation === "POST" || operation === "PATCH") && (
        <div className="mb-4">
          <label>Payload (JSON):</label>
          <textarea rows="6" value={payload} onChange={e => setPayload(e.target.value)} className="w-full border p-2 rounded font-mono" placeholder='{"name":"Example"}' />
        </div>
      )}

      <button onClick={handleTest} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Test API</button>

      <div className="mt-6">
        <label>Response:</label>
        <pre className="border p-4 rounded bg-gray-100">{response}</pre>
      </div>
    </div>
  );
}
