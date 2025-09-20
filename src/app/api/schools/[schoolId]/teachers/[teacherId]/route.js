import admin from "@/lib/firebaseAdmin";
import { verifyIdToken } from "@/lib/authMiddleware";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const { schoolId, teacherId } = params;
  try {
    await verifyIdToken(req);
    const body = await req.json();
    const ref = admin.firestore().collection("schools").doc(schoolId).collection("teachers").doc(teacherId);
    await ref.update(body);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  const { schoolId, teacherId } = params;
  try {
    await verifyIdToken(req);
    const docSnap = await admin
      .firestore()
      .collection("schools")
      .doc(schoolId)
      .collection("teachers")
      .doc(teacherId)
      .get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    return NextResponse.json({ id: docSnap.id, ...docSnap.data() });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
