import admin from "@/lib/firebaseAdmin";
import { verifyIdToken } from "@/lib/authMiddleware";
import { NextResponse } from "next/server";

// Add a new school
export async function POST(req) {
  try {
    const decoded = await verifyIdToken(req);
    if (!decoded.admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const ref = admin.firestore().collection("schools").doc();
    await ref.set(body);
    return NextResponse.json({ success: true, id: ref.id });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Get all schools
export async function GET(req) {
  try {
    const snap = await admin.firestore().collection("schools").get();
    return NextResponse.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
