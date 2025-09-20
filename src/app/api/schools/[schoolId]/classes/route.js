import admin from "@/lib/firebaseAdmin";
import { verifyIdToken } from "@/lib/authMiddleware";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const { schoolId } = params;
  try {
    await verifyIdToken(req);
    const body = await req.json();
    const ref = admin.firestore().collection("schools").doc(schoolId).collection("classes").doc();
    await ref.set({ ...body, schoolId });
    return NextResponse.json({ success: true, id: ref.id });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

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
