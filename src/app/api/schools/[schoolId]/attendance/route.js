import admin from "@/lib/firebaseAdmin";
import { verifyIdToken } from "@/lib/authMiddleware";
import { NextResponse } from "next/server";

// Fetch attendance of school or classroom
export async function GET(req, { params }) {
  const { schoolId } = params;
  try {
    await verifyIdToken(req);
    const url = new URL(req.url);
    const classId = url.searchParams.get("classId");

    let query = admin.firestore().collection("schools").doc(schoolId).collection("attendance");
    if (classId) query = query.where("classId", "==", classId);

    const snap = await query.orderBy("timestamp", "desc").get();
    return NextResponse.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
