"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export function ProfitReport() {
  const data = [
    { date: "Apr 1", revenue: 4000, cost: 2400, profit: 1600 },
    { date: "Apr 5", revenue: 3000, cost: 1398, profit: 1602 },
    { date: "Apr 10", revenue: 2000, cost: 980, profit: 1020 },
    { date: "Apr 15", revenue: 2780, cost: 1908, profit: 872 },
    { date: "Apr 20", revenue: 1890, cost: 1800, profit: 90 },
    { date: "Apr 25", revenue: 2390, cost: 1800, profit: 590 },
    { date: "Apr 30", revenue: 3490, cost: 2300, profit: 1190 },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="revenue" stackId="a" fill="#8884d8" />
        <Bar dataKey="cost" stackId="a" fill="#82ca9d" />
        <Bar dataKey="profit" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  )
}
