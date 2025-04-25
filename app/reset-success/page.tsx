import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CircleDollarSign, CheckCircle } from "lucide-react"

export default function ResetSuccessPage() {
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
            <CheckCircle className="h-16 w-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Password Reset Complete</h2>
            <p className="text-primary-foreground/80 max-w-md mx-auto">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
          </div>

          <div className="bg-primary-foreground/10 p-6 rounded-lg w-full max-w-md mt-8">
            <h3 className="font-medium mb-3">Account Security Tips</h3>
            <ul className="text-sm text-primary-foreground/80 text-left space-y-2">
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-primary-foreground/80 mr-2"></div>
                Regularly update your password
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-primary-foreground/80 mr-2"></div>
                Don't use the same password across multiple sites
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-primary-foreground/80 mr-2"></div>
                Consider using a password manager
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-primary-foreground/80 mr-2"></div>
                Enable two-factor authentication when available
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-auto text-center text-primary-foreground/70 text-sm">
          © 2023 ElectroInventory. All rights reserved.
        </div>
      </div>

      {/* Right side - Success message */}
      <div className="w-full md:w-1/2 bg-background p-8 md:p-12 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold">Success!</h2>
            <p className="text-muted-foreground mt-2">
              Your password has been reset successfully. You can now log in with your new password.
            </p>
          </div>

          <div className="space-y-4">
            <Button className="w-full h-12" asChild>
              <Link href="/login">Go to Login</Link>
            </Button>

            <Button variant="outline" className="w-full h-12" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg mt-8">
            <h3 className="text-sm font-medium mb-2">Need Help?</h3>
            <p className="text-xs text-muted-foreground">
              If you're experiencing any issues with your account, our support team is here to help.
              <Link href="/support" className="text-primary hover:underline block mt-2">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
