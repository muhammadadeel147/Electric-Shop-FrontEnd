import { LoadingSpinner } from "@/components/loading-spinner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="h-9 w-48 bg-muted rounded-md animate-pulse" />
        <div className="h-9 w-32 bg-muted rounded-md animate-pulse" />
      </div>

      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-[180px]" />
      </div>

      <div className="space-y-4">
        <div className="h-10 bg-muted rounded-md animate-pulse w-72" />

        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-48" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-72" />
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] flex items-center justify-center">
            <LoadingSpinner size="lg" text="Loading chart data..." />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
