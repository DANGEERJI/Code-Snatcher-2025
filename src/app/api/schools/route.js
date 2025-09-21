import admin from "@/lib/firebaseAdmin";
import { verifyIdToken } from "@/lib/authMiddleware";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const snap = await admin.firestore().collection("schools").get();
    return NextResponse.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST school with custom ID
export async function POST(req) {
  try {
    const decoded = await verifyIdToken(req);
    if (!decoded.admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { id, name, address, contact } = body;

    if (!id) return NextResponse.json({ error: "Custom School ID is required" }, { status: 400 });
    if (!name || !address) return NextResponse.json({ error: "Name and address are required" }, { status: 400 });

    const schoolRef = admin.firestore().collection("schools").doc(id);

    const docSnap = await schoolRef.get();
    if (docSnap.exists) return NextResponse.json({ error: "ID already exists. Cannot create." }, { status: 400 });

    await schoolRef.set({
      name,
      address,
      contact: contact || null,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, id, name, address, contact: contact || null }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
