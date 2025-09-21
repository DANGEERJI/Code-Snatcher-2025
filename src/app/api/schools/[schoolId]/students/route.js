import admin from "@/lib/firebaseAdmin";
import { verifyIdToken } from "@/lib/authMiddleware";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { schoolId } = params;
  try {
    await verifyIdToken(req);
    const snap = await admin.firestore().collection("schools").doc(schoolId).collection("students").get();
    return NextResponse.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
// POST student with custom ID
export async function POST(req, { params }) {
  const { schoolId } = params;

  try {
    await verifyIdToken(req);
    const body = await req.json();
    const { id, name, rollNumber, age, classId } = body;

    if (!id) return NextResponse.json({ error: "Custom Student ID is required" }, { status: 400 });
    if (!name || !rollNumber) return NextResponse.json({ error: "Name and rollNumber are required" }, { status: 400 });

    const studentRef = admin.firestore()
      .collection("schools")
      .doc(schoolId)
      .collection("students")
      .doc(id);

    const docSnap = await studentRef.get();
    if (docSnap.exists) return NextResponse.json({ error: "ID already exists. Cannot create." }, { status: 400 });

    await studentRef.set({
      name,
      rollNumber,
      age,
      classId,
      schoolId,
      createdAt: new Date().toISOString()
    });

    if (classId) {
      const classRef = admin.firestore()
        .collection("schools")
        .doc(schoolId)
        .collection("classes")
        .doc(classId);

      await classRef.update({
        studentIds: admin.firestore.FieldValue.arrayUnion(id)
      });
    }

    return NextResponse.json({ success: true, id, name, rollNumber, age, classId }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
