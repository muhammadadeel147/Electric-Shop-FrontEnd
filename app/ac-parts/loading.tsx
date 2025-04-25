import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="h-9 w-64 bg-muted rounded-md animate-pulse" />
        <div className="h-9 w-32 bg-muted rounded-md animate-pulse" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-72" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <Skeleton className="h-10 w-full max-w-sm" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>

          <div className="h-10 bg-muted rounded-md animate-pulse w-72 mb-4" />

          <div className="rounded-md border">
            <div className="p-4">
              <div className="h-10 bg-muted rounded-md animate-pulse mb-4" />
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3 mb-4">
                  <Skeleton className="h-12 w-full rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-72" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-9 w-40" />
          </div>

          <div className="rounded-md border">
            <div className="p-4">
              <div className="h-10 bg-muted rounded-md animate-pulse mb-4" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3 mb-4">
                  <Skeleton className="h-12 w-full rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
