
import { CircleDollarSign, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
  fullScreen?: boolean
  text?: string
}

export function LoadingSpinner({ size = "md", className, fullScreen = false, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-black/70 border border-gray-700 shadow-lg">
          <div className="relative">
            {/* Electric-themed spinner */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-full w-full rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            </div>
            <CircleDollarSign className={cn("text-primary", sizeClasses.lg, className)} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap className="h-6 w-6 text-yellow-400 animate-pulse" />
            </div>
            <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-yellow-400 animate-ping" />
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-medium text-white">ElectroInventory</h3>
            {text && <p className="text-sm text-gray-300 mt-1">{text}</p>}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-150"></div>
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-300"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative">
        {/* Electric-themed spinner */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-full w-full rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        </div>
        <CircleDollarSign className={cn("text-primary", sizeClasses[size], className)} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Zap className={cn("text-yellow-400 animate-pulse", size === "lg" ? "h-6 w-6" : "h-3 w-3")} />
        </div>
        <div className="absolute -top-1 -right-1 h-1 w-1 rounded-full bg-yellow-400 animate-ping" />
      </div>
      {text && <p className="text-sm text-muted-foreground mt-2">{text}</p>}
      <div className="mt-2 flex items-center gap-1">
        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></div>
        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse delay-150"></div>
        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse delay-300"></div>
      </div>
    </div>
  )
}