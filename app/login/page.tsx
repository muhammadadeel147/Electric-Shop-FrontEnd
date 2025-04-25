"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CircleDollarSign, Lightbulb, Zap, Eye, EyeOff } from "lucide-react"
import apiClient from "@/utils/apiClient"
import { useLoading } from "@/components/loading-state-provider"
export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false) 
  const { startLoading, stopLoading } = useLoading()
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("") // Clear any previous errors

    try {
      startLoading() // Show the loading spinner with a message
      const response = await apiClient.post("/auth/login", {
        email,
        password,
      })

      if (response.status === 200) {
        const { token } = response.data
        localStorage.setItem("token", token) // Store the token in localStorage
        router.push("/dashboard") // Redirect to the dashboard
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Login failed. Please try again."
      setError(errorMessage)
    } finally {
      stopLoading() // Hide the loading spinner
    }
  }
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Branding and illustration */}
      <div className="w-full md:w-1/2 bg-primary text-primary-foreground p-8 md:p-12 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <CircleDollarSign className="h-8 w-8" />
          <h1 className="text-2xl font-bold">ElectroInventory</h1>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center text-center">
          <div className="mb-6">
            <Lightbulb className="h-16 w-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-primary-foreground/80 max-w-md mx-auto">
              Manage your electrical inventory efficiently with our comprehensive inventory management system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-md mt-8">
            <div className="bg-primary-foreground/10 p-4 rounded-lg text-center">
              <h3 className="font-medium mb-1">10,000+</h3>
              <p className="text-xs text-primary-foreground/70">Products Managed</p>
            </div>
            <div className="bg-primary-foreground/10 p-4 rounded-lg text-center">
              <h3 className="font-medium mb-1">5,000+</h3>
              <p className="text-xs text-primary-foreground/70">Sales Recorded</p>
            </div>
            <div className="bg-primary-foreground/10 p-4 rounded-lg text-center">
              <h3 className="font-medium mb-1">1,000+</h3>
              <p className="text-xs text-primary-foreground/70">Happy Users</p>
            </div>
          </div>
        </div>

        <div className="mt-auto text-center text-primary-foreground/70 text-sm">
          © {new Date().getFullYear()} ElectroInventory. All rights reserved.
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 bg-background p-8 md:p-12 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Sign In</h2>
            <p className="text-muted-foreground mt-2">Enter your credentials to access your account</p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your.email@example.com" className="h-12"  value={email}     onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"} // Toggle input type
                  className="h-12 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)} // Toggle visibility
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-muted-foreground" /> : <Eye className="h-5 w-5 text-muted-foreground" />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button className="w-full h-12 mt-6" type="submit">
              Sign In
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary font-medium hover:underline">
                Create an account
              </Link>
            </p>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-12">
              Google
            </Button>
            <Button variant="outline" className="h-12">
              Microsoft
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
