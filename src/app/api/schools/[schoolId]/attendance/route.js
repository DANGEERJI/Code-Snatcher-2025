import admin from "@/lib/firebaseAdmin";
import { verifyIdToken } from "@/lib/authMiddleware";
import { NextResponse } from "next/server";

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

// POST attendance with custom ID
export async function POST(req, { params }) {
  const { schoolId } = params;

  try {
    await verifyIdToken(req);
    const body = await req.json();
    let { id, classId, records } = body;

    if (!classId) {
      return NextResponse.json({ error: "classId is required in the body" }, { status: 400 });
    }
    if (!records || !Array.isArray(records)) {
      return NextResponse.json({ error: "records array is required" }, { status: 400 });
    }

    const today = new Date().toISOString().split("T")[0];
    if (!id) id = `${classId}_${today}`;

    const ref = admin.firestore()
      .collection("schools")
      .doc(schoolId)
      .collection("attendance")
      .doc(id);

    const existing = await ref.get();
    if (existing.exists) {
      return NextResponse.json({ error: "ID already exists. Cannot create." }, { status: 400 });
    }

    await ref.set({
      classId,
      date: today,
      records,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, id, classId, date: today, records });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}





