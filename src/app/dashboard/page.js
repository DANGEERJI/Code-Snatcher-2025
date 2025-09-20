"use client";

import { useState, useEffect } from "react";
import { User, BookOpen, Building2, School2 } from "lucide-react";
import Select from "react-select"; // npm install react-select

export default function Dashboard() {
  const [role, setRole] = useState(null);
  const [schools, setSchools] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [attendance, setAttendanceData] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [classes, setClasses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [filter, setFilter] = useState("all");

  const baseUrl = "/api";

  useEffect(() => {
    // Set role from localStorage or default
    const storedRole = localStorage.getItem("userRole");
    setRole("admin"); // Example default role

    // Fetch all schools for admin/teacher
    const fetchSchools = async () => {
      try {
        const res = await fetch(`${baseUrl}/schools`);
        const data = await res.json();
        setSchools(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSchools();
  }, []);

const fetchAttendance = async () => {
    try {
      let url;
      if (role === "admin" || role === "teacher") {
        if (selectedClass) {
          url = `${baseUrl}/schools/${selectedSchool}/attendance/${selectedClass}`;
        } else {
          url = `${baseUrl}/schools/${selectedSchool}/attendance`;
        }
        const res = await fetch(url);
        const data = await res.json();

        setAttendanceData(data);
      }
    } catch (err) {
      console.error(err);
    }
};

  // Fetch students/teachers/attendance based on selection
  useEffect(() => {
    if (!selectedSchool) return;

    const fetchStudents = async () => {
      try {
        const res = await fetch(`${baseUrl}/schools/${selectedSchool.value}/students`);
        const data = await res.json();
        setStudents(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchTeachers = async () => {
      try {
        const res = await fetch(`${baseUrl}/schools/${selectedSchool.value}/teachers`);
        const data = await res.json();
        setTeachers(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchClasses = async () => {
      try {
        const res = await fetch(`/api/schools/${selectedSchool}/classes`);
        const data = await res.json();
        setClasses(data); // store classes
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchStudents();
    fetchTeachers();
    fetchAttendance();
    fetchClasses();
  }, [selectedSchool, selectedClass]);

  const filteredAttendance =
    filter === "all" ? attendance : attendance.filter(a => a.status === filter);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-blue-100">
      <h1 className="text-4xl font-bold mb-8">
        {role?.charAt(0).toUpperCase() + role?.slice(1)} Dashboard
      </h1>

      {/* School Selection */}
      {(role === "teacher" || role === "admin") && (
        <div className="mb-6 w-80">
          <Select
            placeholder="Select School"
            options={schools.map(s => ({ value: s.id, label: s.name }))}
            onChange={setSelectedSchool}
          />
        </div>
      )}

      {/* Role-based Cards */}
      {role === "student" && students.length > 0 && (
        <StudentCard student={students[0]} attendance={filteredAttendance} filter={filter} setFilter={setFilter} />
      )}

      {role === "teacher" && selectedSchool && (
        <TeacherCard
          teachers={teachers}
          students={students}
          attendance={filteredAttendance}
          filter={filter}
          setFilter={setFilter}
          selectedTeacher={selectedTeacher}
          setSelectedTeacher={setSelectedTeacher}
          selectedStudent={selectedStudent}
          setSelectedStudent={setSelectedStudent}
        />
      )}

      {role === "admin" && selectedSchool && (
        <AdminCard
          schools={schools}
          teachers={teachers}
          students={students}
          classes={classes}                // all classes of the selected school
          selectedSchool={selectedSchool}  // currently selected school
          setSelectedSchool={setSelectedSchool}
          selectedClass={selectedClass}    // currently selected class
          setSelectedClass={setSelectedClass}
          attendance={filteredAttendance}  // filtered attendance data
          filter={filter}                  // attendance filter (all/present/absent)
          setFilter={setFilter}            // handler to change the filter
          fetchAttendance={fetchAttendance} // function to fetch attendance based on selections
      />
      )}
    </div>
  );
}

// ---------- COMPONENTS ---------- //

function StudentCard({ student, attendance, filter, setFilter }) {
  return (
    <section className="bg-white shadow-xl rounded-2xl p-6">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-blue-700">
        <User /> Student Dashboard
      </h2>
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
        <p><strong>Name:</strong> {student.name}</p>
        <p><strong>Roll No:</strong> {student.rollNumber}</p>
        <p><strong>Gender:</strong> {student.gender}</p>
        <p><strong>DOB:</strong> {new Date(student.dateOfBirth._seconds * 1000).toLocaleDateString()}</p>
        <p><strong>Admission Date:</strong> {new Date(student.admissionDate._seconds * 1000).toLocaleDateString()}</p>
        <p><strong>Class:</strong> {student.classId._path.segments[3]}</p>
        <p><strong>School:</strong> {student.schoolId._path.segments[1]}</p>
        <p><strong>Parent:</strong> {student.parent.name}</p>
        <p><strong>Email:</strong> {student.parent.contact.email || "N/A"}</p>
        <p><strong>Phone:</strong> {student.parent.contact.phone}</p>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold text-gray-700 mb-2">Attendance</h3>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="border rounded p-1 text-sm mb-3">
          <option value="all">All</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
        <ul className="text-sm space-y-1">
          {attendance?.map((a, i) => (
            <li key={i} className={`p-2 rounded ${a.status === "Present" ? "bg-green-500" : "bg-red-500"}`}>
              {a.date} - {a.session} - {a.status}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

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
}) {
  return (
    <section className="bg-white shadow-xl rounded-2xl p-6">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-green-700">
        <BookOpen /> Teacher Dashboard
      </h2>

      <div className="mb-4 w-80">
        <Select
          placeholder="Select Teacher"
          options={teachers.map(t => ({ value: t.id, label: t.name }))}
          onChange={setSelectedTeacher}
        />
      </div>

      <div className="mb-4 w-80">
        <Select
          placeholder="Select Student"
          options={students.map(s => ({ value: s.id, label: s.name }))}
          onChange={setSelectedStudent}
        />
      </div>

      {selectedStudent && (
        <StudentCard student={students.find(s => s.id === selectedStudent.value)} attendance={attendance} filter={filter} setFilter={setFilter} />
      )}
    </section>
  );
}

function AdminCard({
  schools,
  teachers,
  students,
  classes,
  selectedSchool,
  setSelectedSchool,
  selectedClass,
  setSelectedClass,
  attendance,
  filter,
  setFilter,
  fetchAttendance
}){
return (
    <section className="bg-white shadow-xl rounded-2xl p-6">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-purple-700">
        <Building2 /> Admin Dashboard
      </h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl text-center shadow">
          <p className="text-2xl font-bold text-purple-800">{schools.length}</p>
          <p className="text-sm text-gray-600">Schools</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl text-center shadow">
          <p className="text-2xl font-bold text-purple-800">{teachers.length}</p>
          <p className="text-sm text-gray-600">Teachers</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl text-center shadow">
          <p className="text-2xl font-bold text-purple-800">{students.length}</p>
          <p className="text-sm text-gray-600">Students</p>
        </div>
      </div>
      <select
        value={selectedSchool}
        onChange={(e) => setSelectedSchool(e.target.value)}
        className="border rounded p-1 text-sm mb-3"
      >
        {schools.map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>
      <select
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value)}
        className="border rounded p-1 text-sm mb-3"
      >
        <option value="">All Classes</option>
        {classes.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      <button
        onClick={fetchAttendance}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        Fetch Attendance
      </button>
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Attendance Overview</h3>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="border rounded p-1 text-sm mb-3">
          <option value="all">All</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
        <ul className="text-sm space-y-1">
          {attendance?.map((a, i) => (
            <li key={i} className={`p-2 rounded ${a.status === "Present" ? "bg-green-500" : "bg-red-500"}`}>
              {a.date} - {a.session} - {a.status}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
