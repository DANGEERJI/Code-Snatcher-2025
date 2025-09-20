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
