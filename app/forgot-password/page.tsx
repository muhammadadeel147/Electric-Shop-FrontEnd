"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CircleDollarSign, KeyRound, ArrowLeft, CheckCircle2 } from "lucide-react"
import apiClient from "@/utils/apiClient"
import { useLoading } from "@/components/loading-state-provider"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const { startLoading, stopLoading } = useLoading()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!email) {
      setError("Please enter your email address")
      return
    }

    try {
      startLoading()
      const response = await apiClient.post("/auth/forgot-password", { email })
      
      if (response.status === 200) {
        setSubmitted(true)
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to send reset link. Please try again."
      setError(errorMessage)
    } finally {
      stopLoading()
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Branding and illustration */}
      <div className="w-full md:w-1/2 bg-primary text-primary-foreground p-8 md:p-12 flex flex-col">
        {/* Existing left side content */}
        <div className="flex items-center gap-2 mb-8">
          <CircleDollarSign className="h-8 w-8" />
          <h1 className="text-2xl font-bold">ElectroInventory</h1>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center text-center">
          <div className="mb-6">
            <KeyRound className="h-16 w-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Reset Your Password</h2>
            <p className="text-primary-foreground/80 max-w-md mx-auto">
              Don't worry, it happens to the best of us. Enter your email and we'll send you instructions to reset your
              password.
            </p>
          </div>

          <div className="bg-primary-foreground/10 p-6 rounded-lg w-full max-w-md mt-8">
            <h3 className="font-medium mb-3">Need Help?</h3>
            <p className="text-sm text-primary-foreground/80 mb-4">
              If you're having trouble accessing your account, our support team is here to help.
            </p>
            <div className="flex justify-center">
              <Button
                variant="outline"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-auto text-center text-primary-foreground/70 text-sm">
          © {new Date().getFullYear()} ElectroInventory. All rights reserved.
        </div>
      </div>

      {/* Right side - Forgot password form */}
      <div className="w-full md:w-1/2 bg-background p-8 md:p-12 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <Link href="/login" className="inline-flex items-center text-sm text-primary hover:underline mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>

          {submitted ? (
            <div className="text-center py-8">
              <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold">Check Your Email</h2>
              <p className="text-muted-foreground mt-4 mb-6">
                We've sent a password reset link to <span className="font-medium">{email}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Didn't receive an email? Check your spam folder or{" "}
                <button 
                  onClick={() => setSubmitted(false)} 
                  className="text-primary font-medium hover:underline"
                >
                  try again
                </button>
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                  <KeyRound className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Forgot Password</h2>
                <p className="text-muted-foreground mt-2">Enter your email to receive a password reset link</p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your.email@example.com" 
                    className="h-12" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>

                {error && (
                  <div className="text-sm text-destructive">{error}</div>
                )}

                <Button type="submit" className="w-full h-12 mt-6">Send Reset Link</Button>
              </form>

              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                  Remember your password?{" "}
                  <Link href="/login" className="text-primary font-medium hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg mt-8">
                <h3 className="text-sm font-medium mb-2">Security Tips</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Use a strong, unique password</li>
                  <li>• Never share your password with others</li>
                  <li>• Enable two-factor authentication for added security</li>
                  <li>• Regularly update your password</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}