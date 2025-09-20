
import admin from "./firebaseAdmin";
import { NextResponse } from "next/server";


export async function verifyIdToken(req) {
    if (process.env.NODE_ENV === "development") {
        return { uid: "devUser", email: "test@test.com", admin: true };
    }
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        throw new Error("Unauthorized: Missing token");
    }

    const token = authHeader.split(" ")[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        return decodedToken; 
    } catch (err) {
        throw new Error("Unauthorized: Invalid token");
    }
}

export async function requireAdmin(decodedToken) {
    if (!decodedToken.admin) {
        throw new Error("Forbidden: Admins only");
    }
}
