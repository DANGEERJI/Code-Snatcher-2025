"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraduationCap, Users, Shield, BookOpen } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (role: string, email: string, password: string) => {
    setIsLoading(true)

    // Simulate login process
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Store user role in localStorage for demo purposes
    localStorage.setItem("userRole", role)
    localStorage.setItem("userEmail", email)

    // Redirect to dashboard
    router.push("/dashboard")

    setIsLoading(false)
  }

  const LoginForm = ({
    role,
    icon: Icon,
    description,
  }: {
    role: string
    icon: any
    description: string
  }) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <Icon className="h-12 w-12 text-primary mx-auto mb-2" />
          <CardTitle className="text-2xl capitalize">{role} Login</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`${role}-email`}>Email</Label>
            <Input
              id={`${role}-email`}
              type="email"
              placeholder={`Enter your ${role} email`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${role}-password`}>Password</Label>
            <Input
              id={`${role}-password`}
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            className="w-full"
            onClick={() => handleLogin(role, email, password)}
            disabled={isLoading || !email || !password}
          >
            {isLoading ? "Signing in..." : `Sign in as ${role}`}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            <p>Demo credentials:</p>
            <p>Email: {role}@demo.com</p>
            <p>Password: demo123</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">EduManage</h1>
          </Link>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </header>

      {/* Login Section */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-muted-foreground">Choose your role to access the system</p>
          </div>

          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="student" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Student
              </TabsTrigger>
              <TabsTrigger value="teacher" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Teacher
              </TabsTrigger>
              <TabsTrigger value="administrator" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Administrator
              </TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <LoginForm
                role="student"
                icon={Users}
                description="Access your attendance, timetable, and academic information"
              />
            </TabsContent>

            <TabsContent value="teacher">
              <LoginForm
                role="teacher"
                icon={BookOpen}
                description="Manage your classes, track attendance, and view student information"
              />
            </TabsContent>

            <TabsContent value="administrator">
              <LoginForm
                role="administrator"
                icon={Shield}
                description="Full system access to manage schools, users, and analytics"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
