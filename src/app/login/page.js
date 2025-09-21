"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react"; 

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save role & token in localStorage
      localStorage.setItem("userRole", userType);
      const token = await user.getIdToken();
      localStorage.setItem("authToken", token);

      router.push("/dashboard");
    } catch (error) {
      alert("Invalid email or password");
    }
  };

  if (!userType) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 px-4">
        <div className="bg-white w-full max-w-md p-10 rounded-3xl shadow-2xl flex flex-col items-center text-center transform transition-transform hover:scale-105">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-10">
            Select Your Role
          </h1>

          <div className="flex flex-col md:flex-row gap-5 w-full">
            <button
              onClick={() => setUserType("teacher")}
              className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-semibold shadow-lg transition transform hover:-translate-y-1 hover:shadow-xl"
            >
              Teacher
            </button>
            <button
              onClick={() => setUserType("admin")}
              className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-semibold shadow-lg transition transform hover:-translate-y-1 hover:shadow-xl"
            >
              Administrator
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 px-4">
      <div className="bg-white w-full max-w-md p-10 rounded-3xl shadow-2xl flex flex-col items-center transform transition-transform hover:scale-105">
        
        <div className="bg-gradient-to-r from-blue-400 to-purple-500 text-white font-bold rounded-full w-20 h-20 flex items-center justify-center text-3xl mb-6 shadow-xl">
          S
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-2 text-center">
          {userType === "teacher" ? "Teacher Login" : "Admin Login"}
        </h1>
        <p className="text-gray-500 mb-6 text-center">
          Enter your credentials to continue
        </p>

        <form className="w-full space-y-5" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-5 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800 shadow-sm transition"
          />

          {/* Password with Eye Toggle */}
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800 shadow-sm transition pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-500"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          <div className="flex justify-between text-sm text-gray-500">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="h-4 w-4 accent-indigo-500" />
              <span>Remember me</span>
            </label>
            <a href="#" className="hover:underline text-indigo-500">
              Forgot?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-2xl hover:from-indigo-600 hover:to-purple-700 font-semibold shadow-lg transition transform hover:-translate-y-1 hover:shadow-xl"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline font-medium">
            Sign Up
          </Link>
        </p>

        <button
          onClick={() => setUserType("")}
          className="mt-4 text-sm text-gray-400 hover:text-gray-600 hover:underline transition"
        >
          Back
        </button>
      </div>
    </div>
  );
}
