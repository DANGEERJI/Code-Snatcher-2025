"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraduationCap, BookOpen, Users, Clock, CheckCircle, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface TeacherDashboardProps {
  userEmail: string | null
}

export default function TeacherDashboard({ userEmail }: TeacherDashboardProps) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")
    router.push("/")
  }

  // Mock teacher data
  const teacherData = {
    name: "Dr. Priya Singh",
    subject: "Mathematics",
    employeeId: "T001",
    sections: ["12A", "12B", "11A"],
  }

  const timetable = [
    { time: "9:00 AM", class: "12A", subject: "Advanced Calculus", room: "Room 101" },
    { time: "10:00 AM", class: "12B", subject: "Algebra", room: "Room 101" },
    { time: "11:00 AM", class: "11A", subject: "Trigonometry", room: "Room 102" },
    { time: "12:00 PM", subject: "Free Period", class: "-", room: "-" },
    { time: "1:00 PM", subject: "Lunch Break", class: "-", room: "Staff Room" },
    { time: "2:00 PM", class: "12A", subject: "Problem Solving", room: "Room 101" },
    { time: "3:00 PM", subject: "Staff Meeting", class: "-", room: "Conference Room" },
  ]

  const students = [
    { name: "Rahul Sharma", rollNo: "2024001", class: "12A", attendance: 85 },
    { name: "Priya Patel", rollNo: "2024002", class: "12A", attendance: 92 },
    { name: "Amit Kumar", rollNo: "2024003", class: "12A", attendance: 78 },
    { name: "Sneha Gupta", rollNo: "2024004", class: "12A", attendance: 95 },
    { name: "Vikash Jain", rollNo: "2024005", class: "12A", attendance: 88 },
    { name: "Kavya Singh", rollNo: "2024006", class: "12A", attendance: 91 },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Teacher Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {teacherData.name}</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timetable">Timetable</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-bold text-primary">{teacherData.sections.length}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Teaching Sections</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-bold text-primary">{students.length}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Total Students</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-bold text-primary">89%</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Average Attendance</CardDescription>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Teaching Information
                </CardTitle>
                <CardDescription>Your teaching details and sections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Teacher Name</label>
                  <p className="text-lg font-semibold">{teacherData.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Subject</label>
                  <p className="text-lg font-semibold">{teacherData.subject}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Employee ID</label>
                  <p className="text-lg font-semibold">{teacherData.employeeId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Teaching Sections</label>
                  <div className="flex gap-2 mt-1">
                    {teacherData.sections.map((section, index) => (
                      <Badge key={index} variant="secondary">
                        {section}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timetable" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Teaching Schedule
                </CardTitle>
                <CardDescription>Your daily teaching timetable</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {timetable.map((slot, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{slot.time}</Badge>
                        <div>
                          <p className="font-semibold">{slot.subject}</p>
                          {slot.class !== "-" && <p className="text-sm text-muted-foreground">Class: {slot.class}</p>}
                        </div>
                      </div>
                      {slot.room !== "-" && <Badge variant="secondary">{slot.room}</Badge>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Student List
                </CardTitle>
                <CardDescription>Students in your sections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {students.map((student, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-semibold">{student.name}</p>
                          <p className="text-sm text-muted-foreground">Roll No: {student.rollNo}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{student.class}</Badge>
                        <Badge variant={student.attendance >= 85 ? "default" : "destructive"}>
                          {student.attendance}% Attendance
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Attendance Management</CardTitle>
                <CardDescription>Mark and track student attendance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2 mb-4">
                    <Button variant="outline" size="sm">
                      Today
                    </Button>
                    <Button variant="outline" size="sm">
                      This Week
                    </Button>
                    <Button variant="outline" size="sm">
                      This Month
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {students.slice(0, 4).map((student, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-semibold">{student.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {student.rollNo} - {student.class}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-600 bg-transparent"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Present
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 border-red-600 bg-transparent">
                            <XCircle className="h-4 w-4 mr-1" />
                            Absent
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
