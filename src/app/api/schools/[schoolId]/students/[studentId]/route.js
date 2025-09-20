import admin from "@/lib/firebaseAdmin";
import { verifyIdToken } from "@/lib/authMiddleware";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const { schoolId, studentId } = params;
  try {
    await verifyIdToken(req);
    const body = await req.json();
    const ref = admin.firestore().collection("schools").doc(schoolId).collection("students").doc(studentId);
    await ref.update(body);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  const { schoolId, studentId } = params;
  try {
    await verifyIdToken(req);
    const docSnap = await admin
      .firestore()
      .collection("schools")
      .doc(schoolId)
      .collection("students")
      .doc(studentId)
      .get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({ id: docSnap.id, ...docSnap.data() });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}