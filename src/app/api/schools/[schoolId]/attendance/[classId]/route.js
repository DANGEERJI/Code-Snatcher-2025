import admin from "@/lib/firebaseAdmin";
import { verifyIdToken } from "@/lib/authMiddleware";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { schoolId, classId } = params;
  try {
    await verifyIdToken(req);

    const classRef = admin
      .firestore()
      .collection("schools")
      .doc(schoolId)
      .collection("classes")
      .doc(classId);

    const snap = await admin
      .firestore()
      .collection("schools")
      .doc(schoolId)
      .collection("attendance")
      .where("classId", "==", classRef)
      .get();

    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST attendance with custom ID
export async function POST(req, { params }) {
  const { schoolId, classId } = params;

  try {
    await verifyIdToken(req);
    const body = await req.json();
    const { id, date, records } = body;

    if (!id) {
      return NextResponse.json({ error: "Custom ID is required" }, { status: 400 });
    }
    if (!date || !records) {
      return NextResponse.json({ error: "Date and records are required" }, { status: 400 });
    }

    const ref = admin
      .firestore()
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
      date,
      records,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, id, classId, date, records });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}



// PATCH attendance record
export async function PATCH(req, { params }) {
  const { schoolId, classId } = params;
  try {
    await verifyIdToken(req);
    const body = await req.json();
    const ref = admin
      .firestore()
      .collection("schools")
      .doc(schoolId)
      .collection("attendance")
      .doc(classId);
    await ref.update(body);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
