"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const goToLogin = () => {
    router.push("/login");
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100 bg-cover bg-center"
      style={{
        backgroundImage: "url('/school-bg.jpg')", // Local image from public folder
      }}
    >
      <div className="bg-blue-50 bg-opacity-90 p-8 sm:p-10 md:p-12 rounded-3xl shadow-xl flex flex-col items-center max-w-md text-center animate-fadeIn">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-blue-700">
          Welcome to School Attendance
        </h1>
        <p className="text-gray-700 mb-6 text-sm sm:text-base md:text-lg">
          Track attendance easily. Login to continue and mark your attendance.
        </p>
        <button
          onClick={goToLogin}
          className="bg-blue-600 text-white py-3 px-6 sm:py-3.5 sm:px-8 md:py-4 md:px-10 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 font-semibold shadow-lg"
        >
          Go to Login
        </button>
      </div>
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 1s ease-in-out;
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
