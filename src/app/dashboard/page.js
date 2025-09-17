"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../firebase";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) setUser(currentUser);
      else router.push("/login");
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 p-6">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg flex flex-col items-center">
        <h1 className="text-3xl font-bold text-black mb-6 text-center">
          Dashboard
        </h1>
        {user && (
          <p className="text-black mb-4 text-center">Welcome, {user.email}</p>
        )}
        <div className="grid grid-cols-1 gap-4 w-full">
          <a
            href="/attendance"
            className="bg-blue-500 text-white py-4 rounded-lg text-center hover:bg-blue-600"
          >
            Mark Attendance
          </a>
          <a
            href="/report"
            className="bg-green-500 text-white py-4 rounded-lg text-center hover:bg-green-600"
          >
            View Reports
          </a>
        </div>
      </div>
    </div>
  );
}
