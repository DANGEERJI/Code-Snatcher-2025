import admin from "../src/lib/firebaseAdmin.js";


async function makeUserAdmin(uid) {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log(`✅ User ${uid} is now a super admin!`);
    process.exit(0);
}

makeUserAdmin("nOxIcvBmFMO8JY20q1pmEJhaKV62");