import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const { sheet, data } = await req.json();

    if (!sheet || !data) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    for (const row of data) {
      switch (sheet.toLowerCase()) {
        // ------------------------
        // Schools
        // ------------------------
        case "schools": {
          const schoolRef = doc(db, "schools", row.schoolId);
          await setDoc(schoolRef, {
            name: row.name ?? "",
            registrationNumber: row.registrationNumber ?? "",
            address: {
              street: row.street ?? "",
              city: row.city ?? "",
              state: row.state ?? "",
              pincode: row.pincode ?? "",
            },
            contact: {
              email: row.email ?? "",
              phone: row.phone ?? "",
            },
          });
          break;
        }

        // ------------------------
        // Teachers
        // ------------------------
        case "teachers": {
          const teacherRef = doc(db, "schools", row.schoolId, "teachers", row.teacherId);
          await setDoc(teacherRef, {
            authId: row.authId ?? "",
            email: row.email ?? "",
            name: row.name ?? "",
            phone: row.phone ?? "",
            role: row.role ?? "",
            subject: row.subject ?? "",
            schoolId: doc(db, "schools", row.schoolId), // reference
          });
          break;
        }

        // ------------------------
        // Classes
        // ------------------------
        case "classes": {
          const classRef = doc(db, "schools", row.schoolId, "classes", row.classId);
          await setDoc(classRef, {
            name: row.name ?? "",
            schoolId: doc(db, "schools", row.schoolId), // reference
            teacherId: doc(db, "schools", row.schoolId, "teachers", row.teacherId), // reference
            studentIds: row.studentIds
              ? row.studentIds.split(",").map((id) =>
                  doc(db, "schools", row.schoolId, "students", id.trim())
                )
              : [],
          });
          break;
        }

        // ------------------------
        // Students
        // ------------------------
        case "students": {
          const studentRef = doc(db, "schools", row.schoolId, "students", row.studentId);
          await setDoc(studentRef, {
            name: row.name ?? "",
            rollNumber: row.rollNumber ?? "",
            classId: doc(db, "schools", row.schoolId, "classes", row.classId), // reference
            schoolId: doc(db, "schools", row.schoolId), // reference
            gender: row.gender ?? "",
            admissionDate: row.admissionDate ? new Date(row.admissionDate) : null,
            dateOfBirth: row.dateOfBirth ? new Date(row.dateOfBirth) : null,
            address: {
              street: row.street ?? "",
              city: row.city ?? "",
              state: row.state ?? "",
              pincode: row.pincode ?? "",
            },
            parent: {
              name: row.parentName ?? "",
              contact: {
                email: row.parentEmail ?? "",
                phone: row.parentPhone ?? "",
              },
            },
          });
          break;
        }

        // ------------------------
        // Attendance
        // ------------------------
        case "attendance": {
          const attendanceRef = doc(db, "schools", row.schoolId, "attendance", row.attendanceId);
          await setDoc(attendanceRef, {
            schoolId: doc(db, "schools", row.schoolId), // reference
            classId: doc(db, "schools", row.schoolId, "classes", row.classId), // reference
            studentId: doc(db, "schools", row.schoolId, "students", row.studentId), // reference
            teacherId: doc(db, "schools", row.schoolId, "teachers", row.teacherId), // reference
            session: row.session ?? "",
            status: row.status ?? "",
            timestamp: row.timestamp ? new Date(row.timestamp) : new Date(),
          });
          break;
        }

        default:
          console.warn(`Unknown sheet: ${sheet}`);
      }
    }

    return NextResponse.json({ message: "Upload successful" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to upload", details: error.message }, { status: 500 });
  }
}
