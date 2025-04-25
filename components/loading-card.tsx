import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { LoadingSpinner } from "@/components/loading-spinner"

interface LoadingCardProps {
  title?: string
  rows?: number
  withHeader?: boolean
}

export function LoadingCard({ title = "Loading...", rows = 5, withHeader = true }: LoadingCardProps) {
  return (
    <Card>
      {withHeader && (
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Skeleton className="h-4 w-[150px]" />
          </CardTitle>
          <Skeleton className="h-4 w-4 rounded-full" />
        </CardHeader>
      )}
      <CardContent className="pt-6">
        <div className="flex justify-center mb-4">
          <LoadingSpinner size="md" text="Loading data..." />
        </div>
        <div className="space-y-2">
          {Array.from({ length: rows }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
