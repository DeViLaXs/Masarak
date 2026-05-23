'use client'

import * as React from 'react'
import { Cell, Pie, PieChart, Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'

// ==================== Pie Chart Component ====================

export interface PieItem {
  key: string
  label: string
  value: number
  fill: string
}

interface DashboardPieChartProps {
  title: string
  description?: string
  data?: PieItem[]
  isLoading?: boolean
}

export function DashboardPieChart({
  title,
  description,
  data = [],
  isLoading = false,
}: DashboardPieChartProps) {
  const chartConfig = React.useMemo(() => {
    const config: any = {
      value: {
        label: 'العدد',
      },
    }
    data.forEach((item, index) => {
      config[item.key] = {
        label: item.label,
        color: item.fill || `var(--chart-${(index % 5) + 1})`,
      }
    })
    return config
  }, [data])

  if (isLoading) {
    return (
      <Card className="flex flex-col border-border/40 bg-white shadow-sm dark:bg-card h-[380px]">
        <CardHeader className="pb-2 text-right">
          <Skeleton className="h-5 w-40 mb-1 ml-auto" />
          <Skeleton className="h-4 w-28 ml-auto" />
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center">
          <Skeleton className="h-44 w-44 rounded-full" />
        </CardContent>
        <CardFooter className="flex flex-wrap justify-center gap-4 pt-0 pb-6">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </CardFooter>
      </Card>
    )
  }

  const hasData = data && data.length > 0 && data.some(item => item.value > 0);

  return (
    <Card className="flex flex-col border-border/40 bg-white transition-all duration-300 hover:shadow-md dark:bg-card h-[380px]">
      <CardHeader className="pb-2 text-right">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        {description && <CardDescription className="text-xs">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 pb-0 flex items-center justify-center relative">
        {hasData ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square w-full max-h-[220px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel nameKey="value" />}
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="key"
                innerRadius={60}
                outerRadius={80}
                strokeWidth={3}
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill || `var(--chart-${(index % 5) + 1})`}
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground text-sm py-12">
            لا توجد بيانات متاحة حالياً
          </div>
        )}
      </CardContent>
      {hasData && (
        <CardFooter className="flex-col gap-2 pt-0 pb-6">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {data.map((item, index) => (
              <div key={item.key} className="flex items-center gap-1.5">
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: item.fill || `var(--chart-${(index % 5) + 1})` }}
                />
                <span>{item.label}</span>
                <span className="font-semibold text-foreground">({item.value})</span>
              </div>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

// ==================== Bar Chart Component ====================

export interface BarSeries {
  key: string
  label: string
  color: string
}

interface DashboardBarMultipleChartProps {
  title: string
  description?: string
  data?: any[]
  series?: BarSeries[]
  xKey?: string
  isLoading?: boolean
}

export function DashboardBarMultipleChart({
  title,
  description,
  data = [],
  series = [],
  xKey = 'label',
  isLoading = false,
}: DashboardBarMultipleChartProps) {
  const chartConfig = React.useMemo(() => {
    const config: any = {}
    series.forEach((s) => {
      config[s.key] = {
        label: s.label,
        color: s.color,
      }
    })
    return config
  }, [series])

  if (isLoading) {
    return (
      <Card className="flex flex-col border-border/40 bg-white shadow-sm dark:bg-card h-[380px]">
        <CardHeader className="pb-2 text-right">
          <Skeleton className="h-5 w-40 mb-1 ml-auto" />
          <Skeleton className="h-4 w-28 ml-auto" />
        </CardHeader>
        <CardContent className="flex flex-1 flex-col justify-end gap-2 px-6 pb-6">
          <div className="flex items-end justify-between h-[180px]">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex gap-1 items-end w-12 justify-center">
                <Skeleton className="h-[60%] w-4 rounded-t-sm" />
                <Skeleton className="h-[40%] w-4 rounded-t-sm" />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 pt-2 border-t border-border/40">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-8 rounded-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const hasData = data && data.length > 0;

  return (
    <Card className="flex flex-col border-border/40 bg-white transition-all duration-300 hover:shadow-md dark:bg-card h-[380px]">
      <CardHeader className="pb-2 text-right">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        {description && <CardDescription className="text-xs">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 pb-6 flex flex-col justify-center relative px-2 sm:px-6">
        {hasData ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={data}
              margin={{
                left: 12,
                right: 12,
                top: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid vertical={false} className="stroke-border/40" />
              <XAxis
                dataKey={xKey}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-[10px] sm:text-xs fill-muted-foreground font-sans"
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <ChartLegend content={<ChartLegendContent />} className="text-xs" />
              {series.map((s) => (
                <Bar
                  key={s.key}
                  dataKey={s.key}
                  fill={s.color}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={16}
                />
              ))}
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground text-sm py-12">
            لا توجد بيانات متاحة حالياً
          </div>
        )}
      </CardContent>
    </Card>
  )
}
