"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ChartData {
  name: string;
  income: number;
  expense: number;
}

interface FinanceChartProps {
  data: ChartData[];
}

export function FinanceChart({ data }: FinanceChartProps) {
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel border border-border/50 p-3 shadow-lg rounded-xl flex flex-col gap-2 min-w-[150px]">
          <p className="font-medium text-sm border-b border-border/50 pb-1 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: entry.color }} 
                />
                <span className="text-muted-foreground">{entry.name === 'income' ? 'Доход' : 'Расход'}</span>
              </div>
              <span className="font-medium tabular-nums font-mono">
                {new Intl.NumberFormat('ru-RU').format(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-panel border-border/50 mt-4 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Аналитика доходов и расходов</CardTitle>
        <CardDescription>Динамика за последние 6 месяцев (в базовой валюте).</CardDescription>
      </CardHeader>
      <CardContent className="pt-4 pb-4 px-0 sm:px-6">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area 
                type="monotone" 
                dataKey="income" 
                name="income"
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorIncome)" 
                activeDot={{ r: 5, strokeWidth: 0, fill: "hsl(var(--primary))", style: { filter: "drop-shadow(0px 0px 8px rgba(37,99,235,0.8))" } }}
                style={{ filter: "drop-shadow(0px 4px 8px rgba(37,99,235,0.2))" }}
              />
              <Area 
                type="monotone" 
                dataKey="expense" 
                name="expense"
                stroke="hsl(var(--destructive))" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorExpense)" 
                activeDot={{ r: 4, strokeWidth: 0, fill: "hsl(var(--destructive))" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
