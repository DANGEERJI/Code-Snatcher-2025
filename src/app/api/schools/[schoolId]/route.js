import admin from "@/lib/firebaseAdmin";
import { verifyIdToken } from "@/lib/authMiddleware";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const { schoolId } = params;
  console.log(schoolId);
  try {
    const decoded = await verifyIdToken(req);
    if (!decoded.admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const ref = admin.firestore().collection("schools").doc(schoolId);
    await ref.update(body);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  const { schoolId } = params;
  try {
    const docSnap = await admin.firestore().collection("schools").doc(schoolId).get();
    if (!docSnap.exists) return NextResponse.json({ error: "School not found" }, { status: 404 });
    return NextResponse.json({ id: docSnap.id, ...docSnap.data() });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

