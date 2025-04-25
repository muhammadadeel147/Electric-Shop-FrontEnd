import { LoadingCard } from "@/components/loading-card"

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="h-9 w-48 bg-muted rounded-md animate-pulse" />
        <div className="h-5 w-32 bg-muted rounded-md animate-pulse" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <LoadingCard key={i} rows={2} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <LoadingCard title="Recent Sales" rows={5} />
        </div>
        <div className="col-span-3">
          <LoadingCard title="Inventory Overview" rows={3} />
        </div>
      </div>
    </div>
  )
}
