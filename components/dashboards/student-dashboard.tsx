"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraduationCap, User, Calendar, Phone, Mail, MapPin, Clock, BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"

interface StudentDashboardProps {
  userEmail: string | null
}

export default function StudentDashboard({ userEmail }: StudentDashboardProps) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")
    router.push("/")
  }

  // Mock student data
  const studentData = {
    name: "Rahul Sharma",
    rollNumber: "2024001",
    class: "12th Grade",
    section: "A",
    phone: "+91 98765 43210",
    email: userEmail,
    address: "123 Main Street, New Delhi",
    attendance: {
      present: 85,
      total: 100,
      percentage: 85,
    },
  }

  const timetable = [
    { time: "9:00 AM", subject: "Mathematics", teacher: "Dr. Priya Singh", room: "Room 101" },
    { time: "10:00 AM", subject: "Physics", teacher: "Prof. Amit Kumar", room: "Room 102" },
    { time: "11:00 AM", subject: "Chemistry", teacher: "Dr. Sunita Rao", room: "Room 103" },
    { time: "12:00 PM", subject: "English", teacher: "Ms. Kavya Patel", room: "Room 104" },
    { time: "1:00 PM", subject: "Lunch Break", teacher: "-", room: "Cafeteria" },
    { time: "2:00 PM", subject: "Biology", teacher: "Dr. Rajesh Gupta", room: "Room 105" },
    { time: "3:00 PM", subject: "Computer Science", teacher: "Mr. Vikash Jain", room: "Lab 1" },
  ]

  const teachers = [
    { name: "Dr. Priya Singh", subject: "Mathematics", phone: "+91 98765 11111", email: "priya@school.edu" },
    { name: "Prof. Amit Kumar", subject: "Physics", phone: "+91 98765 22222", email: "amit@school.edu" },
    { name: "Dr. Sunita Rao", subject: "Chemistry", phone: "+91 98765 33333", email: "sunita@school.edu" },
    { name: "Ms. Kavya Patel", subject: "English", phone: "+91 98765 44444", email: "kavya@school.edu" },
    { name: "Dr. Rajesh Gupta", subject: "Biology", phone: "+91 98765 55555", email: "rajesh@school.edu" },
    { name: "Mr. Vikash Jain", subject: "Computer Science", phone: "+91 98765 66666", email: "vikash@school.edu" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Student Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {studentData.name}</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="timetable">Timetable</TabsTrigger>
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Student Profile
                </CardTitle>
                <CardDescription>Your personal information and academic details</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                    <p className="text-lg font-semibold">{studentData.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Roll Number</Label>
                    <p className="text-lg font-semibold">{studentData.rollNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Class & Section</Label>
                    <p className="text-lg font-semibold">
                      {studentData.class} - Section {studentData.section}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{studentData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{studentData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{studentData.address}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-bold text-primary">{studentData.attendance.present}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Days Present</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-bold">{studentData.attendance.total}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Total Days</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-bold text-primary">
                    {studentData.attendance.percentage}%
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Attendance Rate</CardDescription>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Attendance Filters</CardTitle>
                <CardDescription>View your attendance by different time periods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Button variant="outline" size="sm">
                    Daily
                  </Button>
                  <Button variant="outline" size="sm">
                    Weekly
                  </Button>
                  <Button variant="outline" size="sm">
                    Monthly
                  </Button>
                </div>
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-2" />
                  <p>Select a filter to view detailed attendance records</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timetable" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Class Timetable
                </CardTitle>
                <CardDescription>Your daily class schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {timetable.map((slot, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{slot.time}</Badge>
                        <div>
                          <p className="font-semibold">{slot.subject}</p>
                          <p className="text-sm text-muted-foreground">{slot.teacher}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{slot.room}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teachers" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Teachers Information
                </CardTitle>
                <CardDescription>Contact details of your subject teachers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teachers.map((teacher, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold">{teacher.name}</h3>
                        <Badge variant="outline">{teacher.subject}</Badge>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            <span>{teacher.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            <span>{teacher.email}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>
}
