// src/lib/authMiddleware.js
import admin from "./firebaseAdmin";
import { NextResponse } from "next/server";

// Verify Firebase ID Token from Authorization header
export async function verifyIdToken(req) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        throw new Error("Unauthorized: Missing token");
    }

    const token = authHeader.split(" ")[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        return decodedToken; // contains uid, email, role claims etc.
    } catch (err) {
        throw new Error("Unauthorized: Invalid token");
    }
}

// Example: protect API route
export async function requireAdmin(decodedToken) {
    if (!decodedToken.admin) {
        throw new Error("Forbidden: Admins only");
    }
}
