import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function RecentSales() {
  return (
    <div className="space-y-8">
      {recentSales.map((sale) => (
        <div key={sale.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary">{getInitials(sale.customer)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{sale.customer}</p>
            <p className="text-sm text-muted-foreground">{sale.items.join(", ")}</p>
          </div>
          <div className="ml-auto font-medium">₹{sale.amount.toFixed(2)}</div>
        </div>
      ))}
    </div>
  )
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

const recentSales = [
  {
    id: 1,
    customer: "Rahul Sharma",
    items: ["LED Bulbs (5)", "Extension Cord"],
    amount: 1250.0,
  },
  {
    id: 2,
    customer: "Priya Patel",
    items: ["Tube Light", "Electrical Tape"],
    amount: 850.0,
  },
  {
    id: 3,
    customer: "Amit Kumar",
    items: ["Wire (10m)", "Switches (4)"],
    amount: 1800.0,
  },
  {
    id: 4,
    customer: "Neha Singh",
    items: ["Ceiling Fan", "Regulator"],
    amount: 2500.0,
  },
  {
    id: 5,
    customer: "Vikram Joshi",
    items: ["Socket Set", "MCB"],
    amount: 1350.0,
  },
]
