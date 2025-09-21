"use client";

import { useState, useEffect } from "react";
import { User, BookOpen, Building2 } from "lucide-react";

// Note: Removed 'Select' from "react-select" and 'useSearchParams' from "next/navigation"
// as they are not available in this environment. They are replaced with standard browser APIs.

// --- Authentication Helpers ---

// Helper function to get the auth token.
// In a real app, this would be managed by your authentication logic (e.g., after login).
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    // The token is retrieved from localStorage.
    return localStorage.getItem("authToken");
  }
  return null;
};

// Custom fetch wrapper to automatically include the Authorization header.
const authFetch = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    // If no token is found, API requests might fail.
    console.warn("Authentication token is missing.");
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.text();
    console.error(`API Error (${response.status}): ${errorData}`);
    throw new Error(`Request failed with status: ${response.status}`);
  }
  
  // Return the JSON response
  return response.json();
};

// --- Formatting Helper ---
const formatTimestamp = (timestamp) => {
  // Guard against null, undefined, etc.
  if (!timestamp) {
    return "N/A";
  }

  let date;

  // Case 1: Firestore-like timestamp object
  if (typeof timestamp === 'object' && '_seconds' in timestamp) {
    date = new Date(timestamp._seconds * 1000);
  } 
  // Case 2: ISO string or other string format parsable by new Date()
  else if (typeof timestamp === 'string') {
    date = new Date(timestamp);
  } 
  // If it's not a recognizable object or a string, we can't process it.
  else {
    return "N/A";
  }

  // Check if the created date is valid. `new Date('invalid string')` results in an invalid date.
  if (isNaN(date.getTime())) {
    return "N/A";
  }

  // Return formatted date, e.g., "9/21/2025"
  return date.toLocaleDateString();
};


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

  // ---------------- Get Role from Storage and Fetch Schools ----------------
  useEffect(() => {
    // In a real app, the role might be determined after login.
    const storedRole = localStorage.getItem("userRole"); 
    setRole(storedRole || 'admin'); // Default to admin if no role is stored
  }, []);
  
  useEffect(() => {
    // Fetch schools only if the user is an admin or teacher
    if (role === "admin" || role === "teacher") {
      authFetch(`${baseUrl}/schools`)
        .then(data => setSchools(Array.isArray(data) ? data : []))
        .catch(err => {
          console.error("Failed to fetch schools:", err);
          setSchools([]); 
        });
    }
  }, [role]);

  // ---------------- Fetch Attendance ----------------
  const fetchAttendance = async (classId = "", students = [], teachers = [], classes = []) => {
    if (!schoolId) return;
  
    let url = `${baseUrl}/schools/${schoolId}/attendance`;
    if (classId) url = `${baseUrl}/schools/${schoolId}/attendance/${classId}`;
  
    try {
      const data = await authFetch(url);
  
      const mapped = Array.isArray(data) ? data.map(a => {
        // Extract IDs robustly from potential reference objects
        const extractedClassId = a.classId?.id || a.classId?._path?.segments?.[3] || a.classId;
        const extractedTeacherId = a.teacherId?.id || a.teacherId?._path?.segments?.[3] || a.teacherId;
        const extractedStudentId = a.studentId?.id || a.studentId?._path?.segments?.[3] || a.studentId;
  
        // Find the corresponding objects in the state arrays
        const classInfo = classes.find(c => c.id === extractedClassId);
        const teacherInfo = teachers.find(t => t.id === extractedTeacherId);
        // Find the student in the original, non-enriched students array if needed
        const studentInfo = students.find(s => s.id === extractedStudentId);
  
        return {
          ...a,
          // Standardize the date field. Prioritize `date`, fall back to `timestamp`.
          date: a.date || a.timestamp || null,
          classId: extractedClassId || "N/A",
          className: classInfo?.name || "N/A",
          teacherId: extractedTeacherId || "N/A",
          teacherName: teacherInfo?.name || "N/A",
          studentId: extractedStudentId || "N/A",
          studentName: studentInfo?.name || "N/A",
        };
      }) : [];
  
      setAttendanceData(mapped);
    } catch (err)      {
      console.error("Error fetching attendance:", err);
      setAttendanceData([]); // Reset on error
    }
  };

  // ---------------- Fetch Students/Teachers/Classes and then Attendance ----------------
  useEffect(() => {
    // This effect runs only when the school changes.
    if (!schoolId) {
      // Clear data and selections when no school is selected
      setStudents([]);
      setTeachers([]);
      setClasses([]);
      setAttendanceData([]);
      setSelectedClass("");
      setSelectedTeacher(null);
      setSelectedStudent(null);
      return;
    }

    setLoading(true);
    // Reset dependent filters when school changes
    setSelectedClass("");
    setSelectedTeacher(null);
    setSelectedStudent(null);

    // Sequentially fetch primary data first
    Promise.all([
      authFetch(`${baseUrl}/schools/${schoolId}/students`),
      authFetch(`${baseUrl}/schools/${schoolId}/teachers`),
      authFetch(`${baseUrl}/schools/${schoolId}/classes`),
    ])
      .then(([studentsData, teachersData, classesData]) => {
        const safeClasses = Array.isArray(classesData) ? classesData : [];
        const safeTeachers = Array.isArray(teachersData) ? teachersData : [];
        const safeStudents = Array.isArray(studentsData) ? studentsData : [];
        const schoolInfo = schools.find(s => s.id === schoolId);

        // Enrich student data with class and school names for display
        const enrichedStudents = safeStudents.map(student => {
          const studentClassId = student.classId?.id || student.classId?._path?.segments?.[3] || student.classId;
          const classInfo = safeClasses.find(c => c.id === studentClassId);
          
          return {
            ...student,
            classId: { name: classInfo?.name || "N/A" },
            schoolId: { name: schoolInfo?.name || "N/A" },
          };
        });

        // Set state for primary data
        setStudents(enrichedStudents);
        setTeachers(safeTeachers);
        setClasses(safeClasses);
        
        // NOW, fetch attendance using the fresh data (pass original students for lookup)
        fetchAttendance("", safeStudents, safeTeachers, safeClasses);
      })
      .catch(err => {
        console.error("Failed to fetch school data:", err);
        // Clear data on error to prevent inconsistent state
        setStudents([]);
        setTeachers([]);
        setClasses([]);
        setAttendanceData([]); // also clear attendance
      })
      .finally(() => {
        setLoading(false);
      });
  }, [schoolId, schools]); // Rerun if schoolId or the schools list changes

  // ---------------- Refetch Attendance when Class Filter Changes ----------------
  useEffect(() => {
    // This effect only runs when the class filter changes, not on the initial load.
    // It relies on the student/teacher data already being in state.
    if (schoolId && students.length > 0) {
      // We need original student data here for lookup
      const originalStudents = students.map(s => ({id: s.id, name: s.name}));
      fetchAttendance(selectedClass, originalStudents, teachers, classes);
    }
  }, [selectedClass]); // ONLY depends on the class filter

  // A generic style for the select dropdowns
  const selectClassName = "w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-700 focus:ring-2 focus:ring-purple-400 focus:outline-none bg-white";

  // Handler for select changes
  const handleSelectChange = (setter) => (e) => {
    const { value, options, selectedIndex } = e.target;
    if (value) {
      setter({ value, label: options[selectedIndex].text });
    } else {
      setter(null);
    }
  };


  // ---------------- Render ----------------
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-blue-100 font-sans">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center md:text-left drop-shadow-sm">
        {role ? role.charAt(0).toUpperCase() + role.slice(1) : ""} Dashboard
      </h1>

      {(role === "teacher" || role === "admin") && (
        <div className="mb-6 w-full md:w-96">
          <select
            value={selectedSchool?.value || ""}
            onChange={handleSelectChange(setSelectedSchool)}
            className={selectClassName}
          >
            <option value="">Select a School</option>
            {Array.isArray(schools) && schools.map(s => ({ value: s.id, label: s.name })).map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
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
          selectClassName={selectClassName}
          handleSelectChange={handleSelectChange}
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
          selectClassName={selectClassName}
          handleSelectChange={handleSelectChange}
        />
      )}
    </div>
  );
}

// ---------------- StudentCard ---------------- //
function StudentCard({ student, attendance, filter, setFilter }) {
  if (!student) return <p className="text-gray-500 text-center">No student selected</p>;

  const filteredAttendance = attendance
    .filter(a => a.studentId === student.id)
    .filter(a => filter === 'all' || a.status?.toLowerCase() === filter);


  return (
    <section className="bg-white rounded-2xl p-6 shadow-md max-w-4xl mx-auto mb-8">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-blue-700">
        <User /> Student Dashboard
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 text-sm">
        <p><strong>Name:</strong> {student?.name || "N/A"}</p>
        <p><strong>Roll No:</strong> {student?.rollNumber || "N/A"}</p>
        <p><strong>Gender:</strong> {student?.gender || "N/A"}</p>
        <p><strong>DOB:</strong> {formatTimestamp(student?.dateOfBirth)}</p>
        <p><strong>Class:</strong> {student?.classId?.name || "N/A"}</p>
        <p><strong>School:</strong> {student?.schoolId?.name || "N/A"}</p>
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
              a.status?.toLowerCase() === "present" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
              <span>{formatTimestamp(a.date)} — {a.session || "N/A"}</span>
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
  selectClassName,
  handleSelectChange
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
        <select
          value={selectedTeacher?.value || ""}
          onChange={handleSelectChange(setSelectedTeacher)}
          className={selectClassName}
        >
          <option value="">Select a Teacher</option>
          {Array.isArray(teachers) && teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <select
          value={selectedStudent?.value || ""}
          onChange={handleSelectChange(setSelectedStudent)}
          className={selectClassName}
        >
          <option value="">Select a Student</option>
          {Array.isArray(students) && students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
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
  selectClassName,
  handleSelectChange
}) {
  // client-side filtering
  const filteredAttendance = attendance
    .filter(a => (selectedClass ? String(a.classId) === String(selectedClass) : true))
    .filter(a => (selectedTeacher ? String(a.teacherId) === String(selectedTeacher?.value) : true))
    .filter(a => (selectedStudent ? String(a.studentId) === String(selectedStudent?.value) : true))
    .filter(a => (filter === "all" ? true : a.status?.toLowerCase() === filter.toLowerCase()));

  const selectedClassObj = Array.isArray(classes) ? classes.find(c => String(c.id) === String(selectedClass)) : null;

  return (
    <section className="bg-white rounded-2xl p-6 shadow-md max-w-5xl mx-auto mb-8">
      <h2 className="text-3xl font-extrabold mb-6 flex items-center gap-3 text-gray-800 bg-gradient-to-r from-purple-50 via-pink-100 to-purple-50 p-4 rounded-xl shadow-sm">
        <Building2 className="w-7 h-7 text-gray-800" /> Admin Dashboard
      </h2>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {[
          { title: "Schools", value: Array.isArray(schools) ? schools.length : 0 },
          { title: "Teachers", value: Array.isArray(teachers) ? teachers.length : 0 },
          { title: "Students", value: Array.isArray(students) ? students.length : 0 },
          { title: "Classes", value: Array.isArray(classes) ? classes.length : 0 }
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
          }}
          className={selectClassName}
        >
          <option value="">All Classes</option>
          {Array.isArray(classes) && classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <select
          value={selectedTeacher?.value || ""}
          onChange={handleSelectChange(setSelectedTeacher)}
          className={selectClassName}
        >
          <option value="">All Teachers</option>
          {Array.isArray(teachers) && teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>

        <select
          value={selectedStudent?.value || ""}
          onChange={handleSelectChange(setSelectedStudent)}
          className={selectClassName}
        >
          <option value="">All Students</option>
          {Array.isArray(students) && students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {/* Show Selected Filters */}
      <div className="mb-6 bg-gray-50 p-3 rounded-lg text-sm text-gray-700 min-h-[4rem]">
        {selectedTeacher && <p><span className="font-semibold">Teacher:</span> {selectedTeacher.label}</p>}
        {selectedClassObj && <p><span className="font-semibold">Class:</span> {selectedClassObj.name} - <span className="text-gray-500">ID: {selectedClassObj.id}</span></p>}
        {selectedStudent && <p><span className="font-semibold">Student:</span> {selectedStudent.label}</p>}
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
              <tr key={i} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-2 px-3">{formatTimestamp(a.date)}</td>
                <td className="py-2 px-3">{a.session || "N/A"}</td>
                <td className="py-2 px-3">{a.className || "N/A"}</td>
                <td className="py-2 px-3">{a.classId || "N/A"}</td>
                <td className="py-2 px-3">{a.teacherName || "N/A"}</td>
                <td className="py-2 px-3">{a.studentName || "N/A"}</td>
                <td className="py-2 px-3">
                  <span
                    className={`py-1 px-2.5 font-semibold text-white rounded-full w-16 text-center text-xs inline-block ${
                      a.status?.toLowerCase() === "present" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {a.status || "N/A"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

