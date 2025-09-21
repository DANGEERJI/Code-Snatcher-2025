import admin from "@/lib/firebaseAdmin";
import { verifyIdToken } from "@/lib/authMiddleware";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { schoolId } = params;
  try {
    await verifyIdToken(req);
    const snap = await admin.firestore().collection("schools").doc(schoolId).collection("teachers").get();
    return NextResponse.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST teacher with custom ID
export async function POST(req, { params }) {
  const { schoolId } = params;

  try {
    await verifyIdToken(req);
    const body = await req.json();
    const { id, name, subject, contact } = body;

    if (!id) return NextResponse.json({ error: "Custom Teacher ID is required" }, { status: 400 });
    if (!name || !subject) return NextResponse.json({ error: "Name and subject are required" }, { status: 400 });

    const teacherRef = admin.firestore()
      .collection("schools")
      .doc(schoolId)
      .collection("teachers")
      .doc(id);

    const docSnap = await teacherRef.get();
    if (docSnap.exists) return NextResponse.json({ error: "ID already exists. Cannot create." }, { status: 400 });

    await teacherRef.set({
      name,
      subject,
      contact: contact || null,
      schoolId,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, id, name, subject, contact: contact || null }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

