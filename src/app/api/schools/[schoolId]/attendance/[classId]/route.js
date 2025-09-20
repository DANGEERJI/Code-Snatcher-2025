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

    
    console.log(snap);

    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching attendance:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
