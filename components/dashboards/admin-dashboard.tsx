"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { GraduationCap, Users, BookOpen, School, BarChart3, Plus, Edit, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface AdminDashboardProps {
  userEmail: string | null
}

export default function AdminDashboard({ userEmail }: AdminDashboardProps) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")
    router.push("/")
  }

  // Mock admin data
  const stats = {
    schools: 45,
    teachers: 156,
    students: 2847,
    attendance: 98.5,
  }

  const schools = [
    { id: 1, name: "Delhi Public School", location: "New Delhi", students: 1200, teachers: 65 },
    { id: 2, name: "Kendriya Vidyalaya", location: "Mumbai", students: 980, teachers: 45 },
    { id: 3, name: "DAV Public School", location: "Bangalore", students: 667, teachers: 46 },
  ]

  const recentTeachers = [
    { id: 1, name: "Dr. Priya Singh", subject: "Mathematics", school: "Delhi Public School", status: "Active" },
    { id: 2, name: "Prof. Amit Kumar", subject: "Physics", school: "Kendriya Vidyalaya", status: "Active" },
    { id: 3, name: "Ms. Kavya Patel", subject: "English", school: "DAV Public School", status: "Pending" },
  ]

  const recentStudents = [
    { id: 1, name: "Rahul Sharma", class: "12A", school: "Delhi Public School", status: "Active" },
    { id: 2, name: "Priya Patel", class: "11B", school: "Kendriya Vidyalaya", status: "Active" },
    { id: 3, name: "Amit Kumar", class: "10C", school: "DAV Public School", status: "Active" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Administrator Dashboard</h1>
              <p className="text-sm text-muted-foreground">System-wide management and analytics</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schools">Schools</TabsTrigger>
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <School className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-3xl font-bold text-primary">{stats.schools}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Total Schools</CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <BookOpen className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-3xl font-bold text-primary">{stats.teachers}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Total Teachers</CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <Users className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-3xl font-bold text-primary">{stats.students.toLocaleString()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Total Students</CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <BarChart3 className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-3xl font-bold text-primary">{stats.attendance}%</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Overall Attendance</CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Teachers</CardTitle>
                  <CardDescription>Latest teacher registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentTeachers.map((teacher) => (
                      <div key={teacher.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{teacher.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {teacher.subject} - {teacher.school}
                          </p>
                        </div>
                        <Badge variant={teacher.status === "Active" ? "default" : "secondary"}>{teacher.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Students</CardTitle>
                  <CardDescription>Latest student enrollments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentStudents.map((student) => (
                      <div key={student.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{student.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {student.class} - {student.school}
                          </p>
                        </div>
                        <Badge variant="default">{student.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schools" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <School className="h-5 w-5" />
                    School Management
                  </CardTitle>
                  <CardDescription>Add, modify, and remove schools</CardDescription>
                </div>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add School
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {schools.map((school) => (
                    <div key={school.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{school.name}</h3>
                        <p className="text-sm text-muted-foreground">{school.location}</p>
                        <div className="flex gap-4 mt-1">
                          <span className="text-sm">Students: {school.students}</span>
                          <span className="text-sm">Teachers: {school.teachers}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-600 bg-transparent">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teachers" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Teacher Management
                  </CardTitle>
                  <CardDescription>Manage teacher accounts and assignments</CardDescription>
                </div>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Teacher
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTeachers.map((teacher) => (
                    <div key={teacher.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{teacher.name}</h3>
                        <p className="text-sm text-muted-foreground">{teacher.subject}</p>
                        <p className="text-sm text-muted-foreground">{teacher.school}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={teacher.status === "Active" ? "default" : "secondary"}>{teacher.status}</Badge>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-600 bg-transparent">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Student Management
                  </CardTitle>
                  <CardDescription>Manage student enrollments and records</CardDescription>
                </div>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Student
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">Class: {student.class}</p>
                        <p className="text-sm text-muted-foreground">{student.school}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">{student.status}</Badge>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-600 bg-transparent">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Analytics & Reporting
                </CardTitle>
                <CardDescription>Custom queries and graphical reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="query-type">Query Type</Label>
                      <select className="w-full p-2 border rounded-md">
                        <option>Attendance Report</option>
                        <option>Performance Analysis</option>
                        <option>School Comparison</option>
                        <option>Teacher Workload</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time-period">Time Period</Label>
                      <select className="w-full p-2 border rounded-md">
                        <option>Last 30 Days</option>
                        <option>Last 3 Months</option>
                        <option>Last 6 Months</option>
                        <option>Last Year</option>
                      </select>
                    </div>
                  </div>
                  <Button className="w-full">Generate Report</Button>
                  <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                    <BarChart3 className="h-16 w-16 mx-auto mb-4" />
                    <p>Select query parameters and click "Generate Report" to view analytics</p>
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
