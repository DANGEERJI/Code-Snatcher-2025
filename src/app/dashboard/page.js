"use client";

import { useState, useEffect } from "react";
import { User, BookOpen, Building2 } from "lucide-react";
import Select from "react-select";

export default function Dashboard() {
  const [role, setRole] = useState(null);
  const [schools, setSchools] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [attendance, setAttendanceData] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const baseUrl = "/api";
  const schoolId = selectedSchool?.value || "";

  // ---------------- Fetch Schools ----------------
  useEffect(() => {
    setRole("admin");
    fetch(`${baseUrl}/schools`)
      .then(res => res.json())
      .then(setSchools)
      .catch(console.error);
  }, []);

  // ---------------- Fetch Attendance ----------------
  const fetchAttendance = async (classId = "") => {
    if (!schoolId) return;

    let url = `${baseUrl}/schools/${schoolId}/attendance`;
    if (classId) url = `${baseUrl}/schools/${schoolId}/attendance/${classId}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      const mapped = data.map(a => ({
        ...a,
        classId: a.classId?.id || a.classId?._path?.segments?.[3] || a.classId || "N/A",
        className: a.className || a.classId?.name || "N/A",
        teacherId: a.teacherId?.id || a.teacherId || "N/A",
        teacherName: a.teacherName || a.teacherId?.name || "N/A",
        studentId: a.studentId?.id || a.studentId || "N/A",
        studentName: a.studentName || a.studentId?.name || "N/A"
      }));

      setAttendanceData(mapped);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  // ---------------- Fetch Students/Teachers/Classes ----------------
  useEffect(() => {
    if (!schoolId) return;

    setLoading(true);

    Promise.all([
      fetch(`${baseUrl}/schools/${schoolId}/students`).then(res => res.json()).then(setStudents),
      fetch(`${baseUrl}/schools/${schoolId}/teachers`).then(res => res.json()).then(setTeachers),
      fetch(`${baseUrl}/schools/${schoolId}/classes`).then(res => res.json()).then(setClasses),
    ])
      .then(() => {
        fetchAttendance(selectedClass);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [schoolId, selectedClass]);

  // ---------------- Shared Styles ----------------
  const selectStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "8px",
      borderColor: "#7C3AED",
      minHeight: "42px",
      boxShadow: "none",
      fontSize: "14px",
    }),
    menu: (provided) => ({ ...provided, borderRadius: "8px", zIndex: 100 }),
  };

  // ---------------- Render ----------------
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-blue-100">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center md:text-left drop-shadow-sm">
        {role ? role.charAt(0).toUpperCase() + role.slice(1) : ""} Dashboard
      </h1>

      {(role === "teacher" || role === "admin") && (
        <div className="mb-6 w-full md:w-96">
          <Select
            placeholder="Select School"
            options={schools.map(s => ({ value: s.id, label: s.name }))}
            onChange={setSelectedSchool}
            value={selectedSchool}
            styles={selectStyles}
            isClearable
          />
        </div>
      )}

      {loading && <p className="text-center text-gray-500">Loading...</p>}

      {role === "student" && students.length > 0 && !loading && (
        <StudentCard
          student={students[0]}
          attendance={attendance}
          filter={filter}
          setFilter={setFilter}
        />
      )}

      {role === "teacher" && selectedSchool && !loading && (
        <TeacherCard
          teachers={teachers}
          students={students}
          attendance={attendance}
          filter={filter}
          setFilter={setFilter}
          selectedTeacher={selectedTeacher}
          setSelectedTeacher={setSelectedTeacher}
          selectedStudent={selectedStudent}
          setSelectedStudent={setSelectedStudent}
          selectStyles={selectStyles}
        />
      )}

      {role === "admin" && selectedSchool && !loading && (
        <AdminCard
          schools={schools}
          teachers={teachers}
          students={students}
          classes={classes}
          selectedClass={selectedClass}
          setSelectedClass={setSelectedClass}
          attendance={attendance}
          filter={filter}
          setFilter={setFilter}
          fetchAttendance={fetchAttendance}
          selectedTeacher={selectedTeacher}
          setSelectedTeacher={setSelectedTeacher}
          selectedStudent={selectedStudent}
          setSelectedStudent={setSelectedStudent}
          selectStyles={selectStyles}
        />
      )}
    </div>
  );
}

// ---------------- StudentCard ---------------- //
function StudentCard({ student, attendance, filter, setFilter }) {
  if (!student) return <p className="text-gray-500 text-center">No student selected</p>;

  const filteredAttendance = attendance.filter(a => a.studentId === student.id);

  return (
    <section className="bg-white rounded-2xl p-6 shadow-md max-w-4xl mx-auto mb-8">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-blue-700">
        <User /> Student Dashboard
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 text-sm">
        <p><strong>Name:</strong> {student?.name || "N/A"}</p>
        <p><strong>Roll No:</strong> {student?.rollNumber || "N/A"}</p>
        <p><strong>Gender:</strong> {student?.gender || "N/A"}</p>
        <p><strong>DOB:</strong> {student?.dateOfBirth?._seconds ? new Date(student.dateOfBirth._seconds * 1000).toLocaleDateString() : "N/A"}</p>
        <p><strong>Class:</strong> {student?.classId?.name || student?.classId || "N/A"}</p>
        <p><strong>School:</strong> {student?.schoolId?.name || student?.schoolId || "N/A"}</p>
        <p><strong>Parent:</strong> {student?.parent?.name || "N/A"}</p>
        <p><strong>Phone:</strong> {student?.parent?.contact?.phone || "N/A"}</p>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold text-gray-700 mb-2">Attendance</h3>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 text-gray-700 w-40 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="all">All</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
        </select>

        <ul className="mt-3 max-h-64 overflow-y-auto">
          {filteredAttendance?.map((a, i) => (
            <li key={i} className={`flex justify-between items-center px-3 py-2 rounded-md mb-1 text-sm ${
              a.status?.toLowerCase() === "present" ? "bg-green-100" : "bg-red-100"
            }`}>
              <span>{a.date || "N/A"} — {a.session || "N/A"}</span>
              <span className="font-semibold px-2 py-1 rounded-full text-xs">{a.status || "N/A"}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ---------------- TeacherCard ---------------- //
function TeacherCard({
  teachers,
  students,
  attendance,
  filter,
  setFilter,
  selectedTeacher,
  setSelectedTeacher,
  selectedStudent,
  setSelectedStudent,
  selectStyles
}) {
  const filteredAttendance = attendance
    .filter(a => (selectedTeacher ? a.teacherId === selectedTeacher?.value : true))
    .filter(a => (selectedStudent ? a.studentId === selectedStudent?.value : true))
    .filter(a => (filter === "all" ? true : a.status?.toLowerCase() === filter.toLowerCase()));

  return (
    <section className="bg-white rounded-2xl p-6 shadow-md max-w-4xl mx-auto mb-8">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-green-700">
        <BookOpen /> Teacher Dashboard
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Select
          placeholder="Select Teacher"
          options={teachers.map(t => ({ value: t.id, label: t.name }))}
          onChange={setSelectedTeacher}
          value={selectedTeacher}
          styles={selectStyles}
          isClearable
        />
        <Select
          placeholder="Select Student"
          options={students.map(s => ({ value: s.id, label: s.name }))}
          onChange={setSelectedStudent}
          value={selectedStudent}
          styles={selectStyles}
          isClearable
        />
      </div>

      {!selectedStudent ? (
        <p className="text-gray-500 text-center">Please select a student to view details</p>
      ) : (
        <StudentCard
          student={students.find(s => s.id === selectedStudent?.value)}
          attendance={filteredAttendance}
          filter={filter}
          setFilter={setFilter}
        />
      )}
    </section>
  );
}

// ---------------- AdminCard ---------------- //
function AdminCard({
  schools,
  teachers,
  students,
  classes,
  selectedClass,
  setSelectedClass,
  attendance,
  filter,
  setFilter,
  fetchAttendance,
  selectedTeacher,
  setSelectedTeacher,
  selectedStudent,
  setSelectedStudent,
  selectStyles
}) {
  // client-side filtering
  const filteredAttendance = attendance
    .filter(a => (selectedClass ? String(a.classId) === String(selectedClass) : true))
    .filter(a => (selectedTeacher ? String(a.teacherId) === String(selectedTeacher?.value) : true))
    .filter(a => (selectedStudent ? String(a.studentId) === String(selectedStudent?.value) : true))
    .filter(a => (filter === "all" ? true : a.status?.toLowerCase() === filter.toLowerCase()));

  // find selected class object
  const selectedClassObj = classes.find(c => String(c.id) === String(selectedClass));

  return (
    <section className="bg-white rounded-2xl p-6 shadow-md max-w-5xl mx-auto mb-8">
    <h2 className="text-3xl font-extrabold mb-6 flex items-center gap-3 text-gray-800 bg-gradient-to-r  via-pink-200  via-pink-200 p-4 rounded-xl shadow-sm">
  <Building2 className="w-7 h-7 text-gray-800" /> Admin Dashboard
</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {[
          { title: "Schools", value: schools.length },
          { title: "Teachers", value: teachers.length },
          { title: "Students", value: students.length },
          { title: "Classes", value: classes.length }
        ].map(item => (
          <div key={item.title} className="p-4 bg-purple-50 rounded-xl shadow text-center">
            <p className="text-2xl font-bold text-purple-700">{item.value}</p>
            <p className="text-gray-600">{item.title}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <select
          value={selectedClass}
          onChange={(e) => {
            setSelectedClass(e.target.value);
            fetchAttendance(e.target.value);
          }}
          className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
        >
          <option value="">All Classes</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <Select
          placeholder="Select Teacher"
          options={teachers.map(t => ({ value: t.id, label: t.name }))}
          onChange={setSelectedTeacher}
          value={selectedTeacher}
          styles={selectStyles}
          isClearable
        />

        <Select
          placeholder="Select Student"
          options={students.map(s => ({ value: s.id, label: s.name }))}
          onChange={setSelectedStudent}
          value={selectedStudent}
          styles={selectStyles}
          isClearable
        />
      </div>

      {/* Show Selected Filters */}
      <div className="mb-6 bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
        {selectedTeacher && (
          <p>
            <span className="font-semibold">Teacher:</span> {selectedTeacher.label}
          </p>
        )}
        {selectedClassObj && (
          <p>
            <span className="font-semibold">Class:</span> {selectedClassObj.name} 
            {" "}- <span className="text-gray-500">ID: {selectedClassObj.id}</span>
          </p>
        )}
        {selectedStudent && (
          <p>
            <span className="font-semibold">Student:</span> {selectedStudent.label}
          </p>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-gray-50 rounded-lg p-4">
        <table className="w-full table-auto text-left text-gray-700">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 px-3">Date</th>
              <th className="py-2 px-3">Session</th>
              <th className="py-2 px-3">Class</th>
              <th className="py-2 px-3">Class ID</th>
              <th className="py-2 px-3">Teacher</th>
              <th className="py-2 px-3">Student</th>
              <th className="py-2 px-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.map((a, i) => (
              <tr key={i} className="border-b border-gray-200">
                <td className="py-2 px-3">{a.date || "N/A"}</td>
                <td className="py-2 px-3">{a.session || "N/A"}</td>
                <td className="py-2 px-3">{a.className || "N/A"}</td>
                <td className="py-2 px-3">{a.classId || "N/A"}</td>
                <td className="py-2 px-3">{a.teacherName || "N/A"}</td>
                <td className="py-2 px-3">{a.studentName || "N/A"}</td>
                <td
                  className={`py-0.5 px-1.5 font-semibold text-white rounded-full w-16 text-center text-xs ${
                    a.status?.toLowerCase() === "present" ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {a.status || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
