import { redirect } from "next/navigation"

export default function Home() {
  // Use a try-catch block to handle any potential errors with the redirect
  try {
    redirect("/dashboard")
  } catch (error) {
    // Fallback UI in case redirect fails
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">ElectroInventory</h1>
          <p className="mt-2">Please navigate to the dashboard</p>
          <a href="/dashboard" className="mt-4 inline-block rounded bg-primary px-4 py-2 text-primary-foreground">
            Go to Dashboard
          </a>
        </div>
      </div>
    )
  }
}
