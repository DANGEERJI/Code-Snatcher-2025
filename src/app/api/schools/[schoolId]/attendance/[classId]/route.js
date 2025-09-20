import admin from "@/lib/firebaseAdmin";
import { verifyIdToken } from "@/lib/authMiddleware";
import { NextResponse } from "next/server";

// Get all attendance records of a specific class
export async function GET(req, { params }) {
  const { schoolId, classId } = params;

  try {
    // Verify the user token (auth)
    await verifyIdToken(req);

    // Query attendance collection under the school and filter by classId
    const snap = await admin
      .firestore()
      .collection("schools")
      .doc(schoolId)
      .collection("attendance")
      .where("classId", "==", classId)
      .get();

    // Map documents to JSON
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching attendance:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
