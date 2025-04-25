"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, ArrowUpRight, CircleDollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react"
import { RecentSales } from "@/components/recent-sales"
import { InventoryOverview } from "@/components/inventory-overview"
import { LowStockAlert } from "@/components/low-stock-alert"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Progress } from "@/components/ui/progress"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹45,231.89</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-500 flex items-center">
                    +20.1% <ArrowUpRight className="ml-1 h-3 w-3" />
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+234</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-500 flex items-center">
                    +12.2% <ArrowUpRight className="ml-1 h-3 w-3" />
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹12,234.00</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-500 flex items-center">
                    +18.7% <ArrowUpRight className="ml-1 h-3 w-3" />
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">573</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-amber-500 flex items-center">
                    12 low stock <AlertCircle className="ml-1 h-3 w-3" />
                  </span>
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Inventory Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <InventoryOverview />
              </CardContent>
            </Card>
          </div>
          <LowStockAlert />
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Analytics</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Revenue Trend</h3>
                  <div className="h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { date: "Mon", revenue: 4000 },
                          { date: "Tue", revenue: 3000 },
                          { date: "Wed", revenue: 5000 },
                          { date: "Thu", revenue: 2780 },
                          { date: "Fri", revenue: 1890 },
                          { date: "Sat", revenue: 3390 },
                          { date: "Sun", revenue: 4490 },
                        ]}
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                      >
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <h3 className="text-sm font-medium mt-4">Sales by Category</h3>
                  <div className="h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Lighting", value: 35 },
                            { name: "Wiring", value: 25 },
                            { name: "Fans", value: 20 },
                            { name: "Other", value: 20 },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                          label
                        >
                          {[
                            { name: "Lighting", value: 35, fill: "#8884d8" },
                            { name: "Wiring", value: 25, fill: "#82ca9d" },
                            { name: "Fans", value: 20, fill: "#ffc658" },
                            { name: "Other", value: 20, fill: "#ff8042" },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Monthly Performance</h3>
                  <div className="h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { month: "Jan", sales: 4000, profit: 2400 },
                          { month: "Feb", sales: 3000, profit: 1398 },
                          { month: "Mar", sales: 9800, profit: 2000 },
                          { month: "Apr", sales: 3908, profit: 2780 },
                          { month: "May", sales: 4800, profit: 1890 },
                          { month: "Jun", sales: 3800, profit: 2390 },
                        ]}
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                      >
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="sales" fill="#8884d8" />
                        <Bar dataKey="profit" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <h3 className="text-sm font-medium mt-4">Top Selling Products</h3>
                  <div className="h-[150px] overflow-auto">
                    <div className="space-y-2">
                      {[
                        { name: "Osaka LED Bulb 10W", sales: 120, percentage: 100 },
                        { name: "Phinix LED Bulb 9W", sales: 85, percentage: 71 },
                        { name: "Phipro LED Bulb 15W", sales: 78, percentage: 65 },
                        { name: "Philix LED Bulb 7W", sales: 45, percentage: 38 },
                        { name: "Havells Copper Wire 1.5mm", sales: 42, percentage: 35 },
                      ].map((product, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-32 truncate text-xs">{product.name}</div>
                          <Progress value={product.percentage} className="h-2 flex-1" />
                          <div className="text-xs text-muted-foreground w-8 text-right">{product.sales}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
