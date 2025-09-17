"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    document.title = "School Attendance Login";
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error) {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white w-80 p-8 rounded-2xl shadow-lg flex flex-col items-center">
        {/* Logo */}
        <div className="bg-blue-600 text-white font-bold rounded-full w-14 h-14 flex items-center justify-center text-xl mb-5">
          S
        </div>

        {/* Header */}
        <h1 className="text-xl font-bold text-black mb-1 text-center">
          Login to Your Account
        </h1>
        <p className="text-center text-black mb-5 text-sm">
          Enter your credentials
        </p>

        {/* Form */}
        <form className="w-full space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
          />

          <div className="flex justify-between text-sm text-black">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="h-4 w-4" />
              <span>Remember me</span>
            </label>
            <a href="#" className="hover:underline text-blue-600">
              Forgot?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-black mt-5 text-sm">
          Don't have an account?{" "}
          <a href="#" className="text-blue-600 hover:underline font-medium">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
