"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const goToLogin = () => {
    router.push("/login");
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-hidden">
      {}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-sm"
        style={{
          backgroundImage: "url('/school-bg.jpg')",
        }}
      ></div>

      {}
      <div className="absolute inset-0 bg-black/70"></div>

      {}
      <div className="absolute top-5 right-5 z-10">
        <button
          onClick={goToLogin}
          className="bg-blue-600 text-white py-2 px-5 rounded-full hover:bg-blue-700 transition-all duration-300 shadow-sm text-sm font-medium"
        >
          Login
        </button>
      </div>

      {}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center min-h-[80vh] w-full max-w-6xl mx-auto px-4 py-20 gap-10">
        {}
        <div className="md:w-1/2 text-white text-left">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Welcome to UDAY
          </h1>
          <p className="text-gray-100 mb-6 text-base md:text-lg leading-relaxed">
            UDAY helps teachers and admins track and manage student attendance easily.  
            View reports, manage records, and simplify school operations.
          </p>
          <p className="text-gray-300 text-sm md:text-base">
            Simple, reliable, and efficient for modern school management.
          </p>
        </div>

        {}
        <div className="md:w-1/2 flex justify-center">
          <div className="w-64 h-64 md:w-80 md:h-80 bg-white/10 rounded-2xl shadow-lg overflow-hidden flex items-center justify-center">
            <img
              src="/attendance-dashboard.jpg"
              alt="Attendance Dashboard Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {}
      <div className="relative z-10 text-center text-gray-400 text-xs py-8">
        &copy; {new Date().getFullYear()} UDAY. All rights reserved.
      </div>
    </div>
  );
}
