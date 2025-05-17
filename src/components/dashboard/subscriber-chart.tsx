// src/components/dashboard/subscriber-chart.tsx
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"

// Placeholder data for the last 6 months
const chartData = [
  { month: "January", newSubscribers: 186, lostSubscribers: 80 },
  { month: "February", newSubscribers: 305, lostSubscribers: 90 },
  { month: "March", newSubscribers: 237, lostSubscribers: 70 },
  { month: "April", newSubscribers: 273, lostSubscribers: 110 },
  { month: "May", newSubscribers: 209, lostSubscribers: 60 },
  { month: "June", newSubscribers: 214, lostSubscribers: 75 },
]

const chartConfig = {
  newSubscribers: {
    label: "New Subscribers",
    color: "hsl(var(--chart-1))", // Orange/Amber Accent #FCA311
  },
  lostSubscribers: {
    label: "Lost Subscribers",
    color: "hsl(var(--chart-2))", // Real Red  #D00000
  }
} satisfies ChartConfig

export function SubscriberChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full aspect-video">
      <ResponsiveContainer width="100%" height={350}>
         <BarChart data={chartData}>
           <CartesianGrid vertical={false} />
           <XAxis
             dataKey="month"
             tickLine={false}
             tickMargin={10}
             axisLine={false}
             // tickFormatter={(value) => value.slice(0, 3)} // Abbreviate month names if needed
           />
           <YAxis
             tickLine={false}
             axisLine={false}
             tickMargin={10}
             // tickCount={6} // Adjust based on expected data range
           />
           <ChartTooltip
             cursor={false}
             content={<ChartTooltipContent indicator="dot" />}
           />
           <ChartLegend content={<ChartLegendContent />} />
           <Bar dataKey="newSubscribers" fill="var(--color-newSubscribers)" radius={4} />
           <Bar dataKey="lostSubscribers" fill="var(--color-lostSubscribers)" radius={4} />
         </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
