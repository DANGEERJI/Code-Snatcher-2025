"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import StudentDashboard from "@/components/dashboards/student-dashboard"
import TeacherDashboard from "@/components/dashboards/teacher-dashboard"
import AdminDashboard from "@/components/dashboards/admin-dashboard"

export default function DashboardPage() {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    const email = localStorage.getItem("userEmail")

    if (!role || !email) {
      router.push("/login")
      return
    }

    setUserRole(role)
    setUserEmail(email)
  }, [router])

  if (!userRole) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const renderDashboard = () => {
    switch (userRole) {
      case "student":
        return <StudentDashboard userEmail={userEmail} />
      case "teacher":
        return <TeacherDashboard userEmail={userEmail} />
      case "administrator":
        return <AdminDashboard userEmail={userEmail} />
      default:
        return <div>Invalid role</div>
    }
  }

  return renderDashboard()
}
