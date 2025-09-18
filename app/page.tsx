import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, GraduationCap, BookOpen, Award, Phone, Mail, MapPin } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">EduManage</h1>
          </div>
          <Link href="/login">
            <Button className="bg-primary hover:bg-primary/90">Login</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            Smart India Hackathon 2024
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-balance mb-6">Complete School Management System</h2>
          <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
            Streamline your educational institution with our comprehensive platform designed for students, teachers, and
            administrators.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Platform Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader className="pb-2">
                <Users className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle className="text-3xl font-bold text-primary">2,847</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">Students Enrolled</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader className="pb-2">
                <GraduationCap className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle className="text-3xl font-bold text-primary">156</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">Teachers</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader className="pb-2">
                <BookOpen className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle className="text-3xl font-bold text-primary">45</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">Schools</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader className="pb-2">
                <Award className="h-12 w-12 text-primary mx-auto mb-2" />
                <CardTitle className="text-3xl font-bold text-primary">98.5%</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">Attendance Rate</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Student Portal</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Access attendance records, timetables, teacher information, and personal details in one centralized
                  dashboard.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <GraduationCap className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Teacher Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Manage class schedules, track student attendance, view section information, and access student lists
                  efficiently.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Award className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Admin Control</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Complete administrative control with ability to add, modify, and remove schools, teachers, and
                  students with advanced analytics.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <Phone className="h-8 w-8 text-primary mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Phone</h4>
              <p className="text-muted-foreground">+91 98765 43210</p>
            </div>

            <div className="text-center">
              <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Email</h4>
              <p className="text-muted-foreground">support@edumanage.in</p>
            </div>

            <div className="text-center">
              <MapPin className="h-8 w-8 text-primary mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Address</h4>
              <p className="text-muted-foreground">New Delhi, India</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-semibold">EduManage</span>
          </div>
          <p className="text-muted-foreground">© 2024 EduManage. Built for Smart India Hackathon.</p>
        </div>
      </footer>
    </div>
  )
}
