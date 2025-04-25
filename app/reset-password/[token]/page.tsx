"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CircleDollarSign, KeyRound, ShieldCheck, Eye, EyeOff } from "lucide-react"
import apiClient from "@/utils/apiClient"
import { useLoading } from "@/components/loading-state-provider"

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  // In a real app, you would validate the token here
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { startLoading, stopLoading } = useLoading()
  const token = params.token

  // Password validation function
  const validatePassword = (password: string) => {
   
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate password
    if (!validatePassword(password)) {
      setError("Password does not meet requirements")
      return
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      startLoading()
      
      // Call the reset password API endpoint with the token from URL
      const response = await apiClient.post(`/auth/reset-password/${token}`, {
        password
      })

      if (response.status === 200) {
        router.push("/reset-success")
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to reset password. The link may be expired."
      setError(errorMessage)
    } finally {
      stopLoading()
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
            <ShieldCheck className="h-16 w-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Create New Password</h2>
            <p className="text-primary-foreground/80 max-w-md mx-auto">
              Your password reset link is valid. Please create a new password for your account.
            </p>
          </div>

          <div className="bg-primary-foreground/10 p-6 rounded-lg w-full max-w-md mt-8">
            <h3 className="font-medium mb-3">Password Requirements</h3>
            <ul className="text-sm text-primary-foreground/80 text-left space-y-2">
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-primary-foreground/80 mr-2"></div>
                At least 8 characters long
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-primary-foreground/80 mr-2"></div>
                Include at least one uppercase letter
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-primary-foreground/80 mr-2"></div>
                Include at least one number
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-primary-foreground/80 mr-2"></div>
                Include at least one special character
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-auto text-center text-primary-foreground/70 text-sm">
          © 2023 ElectroInventory. All rights reserved.
        </div>
      </div>

      {/* Right side - Reset password form */}
      <div className="w-full md:w-1/2 bg-background p-8 md:p-12 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
              <KeyRound className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Reset Your Password</h2>
            <p className="text-muted-foreground mt-2">Enter a new password for your account</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input type="hidden" name="token" value={token} />

            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  className="h-12 pr-10" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Make sure your password is strong and secure</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input 
                  id="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"}
                  className="h-12 pr-10" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}

            <Button type="submit" className="w-full h-12 mt-6">
              Reset Password
            </Button>
          </form>

          <div className="bg-muted/50 p-4 rounded-lg mt-8">
            <h3 className="text-sm font-medium mb-2">After Resetting</h3>
            <p className="text-xs text-muted-foreground">
              After resetting your password, you'll be redirected to the login page where you can sign in with your new
              credentials. If you didn't request this password reset, please contact our support team immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
