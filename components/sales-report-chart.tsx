"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export function SalesReportChart() {
  const data = [
    { date: "Apr 1", sales: 4000, transactions: 24 },
    { date: "Apr 5", sales: 3000, transactions: 18 },
    { date: "Apr 10", sales: 2000, transactions: 12 },
    { date: "Apr 15", sales: 2780, transactions: 19 },
    { date: "Apr 20", sales: 1890, transactions: 14 },
    { date: "Apr 25", sales: 2390, transactions: 17 },
    { date: "Apr 30", sales: 3490, transactions: 21 },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line yAxisId="right" type="monotone" dataKey="transactions" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  )
}
