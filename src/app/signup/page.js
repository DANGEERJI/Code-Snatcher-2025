"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react"; // install lucide-react: npm i lucide-react

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState(""); 
  const router = useRouter();

  useEffect(() => {
    document.title = "School Attendance Sign Up";
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!userType) {
      alert("Please select a role first");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);

      if (userType === "teacher") router.push("/dashboard-teacher");
      else if (userType === "admin") router.push("/dashboard-admin");
    } catch (error) {
      alert(error.message);
    }
  };

  if (!userType) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 px-4">
        <div className="bg-white w-full max-w-md p-10 rounded-3xl shadow-2xl flex flex-col items-center text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
            Select Your Role
          </h1>
          <div className="flex flex-col md:flex-row gap-5 w-full">
            <button
              onClick={() => setUserType("teacher")}
              className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold shadow-lg transition transform hover:-translate-y-1"
            >
              Teacher
            </button>
            <button
              onClick={() => setUserType("admin")}
              className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-semibold shadow-lg transition transform hover:-translate-y-1"
            >
              Administrator
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 px-4">
      <div className="bg-white w-full max-w-md p-10 rounded-3xl shadow-2xl flex flex-col items-center">
        <div className="bg-indigo-500 text-white font-bold rounded-full w-16 h-16 flex items-center justify-center text-2xl mb-6 shadow-lg">
          S
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 text-center">
          {userType === "teacher" ? "Teacher Sign Up" : "Admin Sign Up"}
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Create your account to continue
        </p>

        <form className="w-full space-y-4" onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-800"
          />

          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-800 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-500"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white py-3 rounded-2xl font-semibold shadow-lg transition transform hover:-translate-y-1"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-500 hover:underline font-medium">
            Login
          </Link>
        </p>

        <button
          onClick={() => setUserType("")}
          className="mt-4 text-sm text-gray-500 hover:underline"
        >
          Back
        </button>
      </div>
    </div>
  );
}
