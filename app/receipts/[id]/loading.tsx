import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-48" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center border-b">
          <CardTitle>
            <Skeleton className="h-8 w-48 mx-auto" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-72 mx-auto mb-1" />
          </CardDescription>
          <CardDescription>
            <Skeleton className="h-4 w-48 mx-auto" />
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="text-right">
              <Skeleton className="h-4 w-32 ml-auto mb-2" />
              <Skeleton className="h-6 w-48 ml-auto" />
            </div>
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="text-right">
              <Skeleton className="h-4 w-36 ml-auto mb-2" />
              <Skeleton className="h-6 w-24 ml-auto" />
            </div>
          </div>

          <Skeleton className="h-1 w-full my-4" />

          <div className="rounded-md border">
            <div className="p-4">
              <div className="h-10 bg-muted rounded-md animate-pulse mb-4" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3 mb-4">
                  <Skeleton className="h-12 w-full rounded-md" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-col items-end">
            <div className="flex justify-between w-48 mb-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex justify-between w-48 mb-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-1 w-48 my-2" />
            <div className="flex justify-between w-48 font-bold">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col border-t pt-6">
          <Skeleton className="h-4 w-64 mx-auto mb-2" />
          <Skeleton className="h-3 w-80 mx-auto" />
        </CardFooter>
      </Card>
    </div>
  )
}
