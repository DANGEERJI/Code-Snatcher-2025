"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState(""); 
  const router = useRouter();

  useEffect(() => {
    document.title = "School Attendance Login";
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!userType) {
      alert("Please select user type first");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);

      if (userType === "teacher") {
        router.push("/dashboard-teacher");
      } else if (userType === "admin") {
        router.push("/dashboard-admin");
      }
    } catch (error) {
      alert("Invalid email or password");
    }
  };

  if (!userType) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50 px-4">
        <div className="bg-white w-full max-w-md p-8 md:p-10 rounded-3xl shadow-xl flex flex-col items-center text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
            Select Your Role
          </h1>

          <div className="flex flex-col md:flex-row gap-5 w-full">
            <button
              onClick={() => setUserType("teacher")}
              className="flex-1 py-4 rounded-2xl bg-blue-400 hover:bg-blue-500 text-white font-semibold shadow-md transition transform hover:-translate-y-1"
            >
              Teacher
            </button>
            <button
              onClick={() => setUserType("admin")}
              className="flex-1 py-4 rounded-2xl bg-green-400 hover:bg-green-500 text-white font-semibold shadow-md transition transform hover:-translate-y-1"
            >
              Administrator
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50 px-4">
      <div className="bg-white w-full max-w-md p-8 md:p-10 rounded-3xl shadow-xl flex flex-col items-center">
        {}
        <div className="bg-blue-500 text-white font-bold rounded-full w-16 h-16 flex items-center justify-center text-2xl mb-6 shadow-lg">
          S
        </div>

        {}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 text-center">
          {userType === "teacher" ? "Teacher Login" : "Admin Login"}
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Enter your credentials to continue
        </p>

        {}
        <form className="w-full space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800"
          />

          <div className="flex justify-between text-sm text-gray-600">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="h-4 w-4" />
              <span>Remember me</span>
            </label>
            <a href="#" className="hover:underline text-blue-500">
              Forgot?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-2xl hover:bg-blue-600 transition font-semibold shadow-md transform hover:-translate-y-1"
          >
            Login
          </button>
        </form>

        {}
        <p className="text-center text-gray-600 mt-6 text-sm">
          Don't have an account?{" "}
          <a href="#" className="text-blue-500 hover:underline font-medium">
            Sign Up
          </a>
        </p>

        {}
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
