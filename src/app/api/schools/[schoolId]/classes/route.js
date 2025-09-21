import admin from "@/lib/firebaseAdmin";
import { verifyIdToken } from "@/lib/authMiddleware";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { schoolId } = params;
  try {
    await verifyIdToken(req);
    const snap = await admin.firestore().collection("schools").doc(schoolId).collection("classes").get();
    return NextResponse.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


//  POST class with custom ID
export async function POST(req, { params }) {
  const { schoolId } = params;

  try {
    await verifyIdToken(req);
    const body = await req.json();
    const { id, name, teacherId, section } = body;

    if (!id) return NextResponse.json({ error: "Custom Class ID is required" }, { status: 400 });
    if (!name || !teacherId) return NextResponse.json({ error: "Class name and teacherId are required" }, { status: 400 });

    const classRef = admin.firestore()
      .collection("schools")
      .doc(schoolId)
      .collection("classes")
      .doc(id);

    const docSnap = await classRef.get();
    if (docSnap.exists) return NextResponse.json({ error: "ID already exists. Cannot create." }, { status: 400 });

    await classRef.set({
      name,
      teacherId,
      section: section || null,
      studentIds: [],
      schoolId,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, id, name, teacherId, section: section || null }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
