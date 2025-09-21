import admin from "@/lib/firebaseAdmin";
import { verifyIdToken } from "@/lib/authMiddleware";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { schoolId, classId } = params;
  try {
    await verifyIdToken(req);
    const classDoc = await admin.firestore().collection("schools").doc(schoolId).collection("classes").doc(classId).get();
    if (!classDoc.exists) return NextResponse.json({ error: "Class not found" }, { status: 404 });

    const { studentIds = [] } = classDoc.data();
    const students = await Promise.all(studentIds.map(r => r.get().then(s => ({ id: s.id, ...s.data() }))));
    return NextResponse.json(students);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
// POST student with custom ID
export async function POST(req, { params }) {
  const { schoolId, classId } = params;

  try {
    await verifyIdToken(req);
    const body = await req.json();
    const { id, name, rollNumber, age } = body;

    if (!id) return NextResponse.json({ error: "Custom ID is required" }, { status: 400 });
    if (!name || !rollNumber) return NextResponse.json({ error: "Name and rollNumber are required" }, { status: 400 });

    const studentRef = admin.firestore()
      .collection("schools")
      .doc(schoolId)
      .collection("students")
      .doc(id);

    const existing = await studentRef.get();
    if (existing.exists) return NextResponse.json({ error: "ID already exists. Cannot create." }, { status: 400 });

    await studentRef.set({
      name,
      rollNumber,
      age,
      classId,
      schoolId,
      createdAt: new Date().toISOString()
    });

    const classRef = admin.firestore()
      .collection("schools")
      .doc(schoolId)
      .collection("classes")
      .doc(classId);

    await classRef.update({
      studentIds: admin.firestore.FieldValue.arrayUnion(id)
    });

    return NextResponse.json({ success: true, id, name, rollNumber, age, classId });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
