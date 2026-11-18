
"use client"

import { useMemo, useState } from "react"
import { ArrowLeft, ArrowUpRight, CalendarDays, CircleDollarSign, Package, Search, ShoppingCart, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

const money = new Intl.NumberFormat("es-ES", { style: "currency", currency: "USD" })
const periods = ["Hoy", "7 días", "30 días"]
const chartData = [
  { day: "Lun", sales: 420, profit: 156 }, { day: "Mar", sales: 610, profit: 232 },
  { day: "Mié", sales: 530, profit: 194 }, { day: "Jue", sales: 780, profit: 301 },
  { day: "Vie", sales: 920, profit: 356 }, { day: "Sáb", sales: 1080, profit: 421 },
  { day: "Dom", sales: 690, profit: 268 },
]
const recentSales = [
  { id: "ORD-1048", date: "Hoy, 14:32", items: "Café molido, Leche", total: 42.5, profit: 16.2, status: "Completada" },
  { id: "ORD-1047", date: "Hoy, 13:18", items: "Arroz, Aceite, Azúcar", total: 68.75, profit: 21.4, status: "Completada" },
  { id: "ORD-1046", date: "Hoy, 11:06", items: "Pan artesanal", total: 18.0, profit: 7.2, status: "Completada" },
  { id: "ORD-1045", date: "Ayer, 19:44", items: "Café molido, Pan artesanal", total: 36.5, profit: 14.8, status: "Completada" },
]
const topProducts = [
  { name: "Café molido", units: 84, revenue: 504, margin: "38%" },
  { name: "Pan artesanal", units: 61, revenue: 305, margin: "40%" },
  { name: "Leche entera", units: 48, revenue: 144, margin: "31%" },
]

export function SalesScreen() {
  const [period, setPeriod] = useState("7 días")
  const [query, setQuery] = useState("")
  const filteredSales = useMemo(() => recentSales.filter((sale) => `${sale.id} ${sale.items}`.toLowerCase().includes(query.toLowerCase())), [query])
  const kpis = [
    { label: "Ventas del día", value: money.format(1248.5), change: "+12.5%", icon: ShoppingCart },
    { label: "Ingresos", value: money.format(5842), change: "+8.2%", icon: CircleDollarSign },
    { label: "Utilidad estimada", value: money.format(2216), change: "+14.8%", icon: TrendingUp },
    { label: "Ticket promedio", value: money.format(48.68), change: "+3.1%", icon: ArrowUpRight },
  ]

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className={buttonVariants({ variant: "outline", size: "icon" })} aria-label="Volver al panel principal"><ArrowLeft /></Link>
            <div><p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Análisis comercial</p><h1 className="text-2xl font-semibold tracking-tight">Ventas</h1></div>
          </div>
          <div className="flex gap-2"><Link href="/pos" className={buttonVariants({ variant: "outline" })}><ShoppingCart data-icon="inline-start" />Ir al POS</Link><Button><CalendarDays data-icon="inline-start" />Exportar reporte</Button></div>
        </header>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-lg font-medium">Resumen del negocio</h2><p className="text-sm text-muted-foreground">Una vista rápida del rendimiento de tu operación.</p></div><div className="flex rounded-lg border bg-card p-1">{periods.map((item) => <Button key={item} size="sm" variant={period === item ? "secondary" : "ghost"} onClick={() => setPeriod(item)}>{item}</Button>)}</div></div>
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicadores de ventas">{kpis.map(({ label, value, change, icon: Icon }) => <Card key={label}><CardHeader className="flex-row items-center justify-between pb-2"><CardDescription>{label}</CardDescription><Icon className="size-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-semibold">{value}</div><p className="mt-1 flex items-center gap-1 text-xs text-primary"><ArrowUpRight className="size-3" />{change} <span className="text-muted-foreground">vs. periodo anterior</span></p></CardContent></Card>)}</section>

        <section className="grid gap-4 lg:grid-cols-[1.6fr_1fr]"><Card><CardHeader><CardTitle>Ingresos y utilidad</CardTitle><CardDescription>Rendimiento de los últimos 7 días</CardDescription></CardHeader><CardContent><ChartContainer config={{ sales: { label: "Ingresos", color: "var(--chart-1)" }, profit: { label: "Utilidad", color: "var(--chart-2)" } }} className="h-[280px] w-full"><BarChart accessibilityLayer data={chartData}><CartesianGrid vertical={false} /><XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} /><ChartTooltip content={<ChartTooltipContent />} /><Bar dataKey="sales" fill="var(--color-sales)" radius={4} /><Bar dataKey="profit" fill="var(--color-profit)" radius={4} /></BarChart></ChartContainer></CardContent></Card><Card><CardHeader><CardTitle>Productos más vendidos</CardTitle><CardDescription>Por unidades en el periodo</CardDescription></CardHeader><CardContent className="flex flex-col gap-4">{topProducts.map((product, index) => <div key={product.name} className="flex items-center gap-3"><div className="flex size-8 items-center justify-center rounded-md bg-secondary text-sm font-medium">{index + 1}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{product.name}</p><p className="text-xs text-muted-foreground">{product.units} unidades · {money.format(product.revenue)}</p></div><Badge variant="secondary">{product.margin}</Badge></div>)}</CardContent></Card></section>

        <Card><CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between"><div><CardTitle>Ventas recientes</CardTitle><CardDescription>Últimas órdenes registradas</CardDescription></div><div className="relative w-full sm:w-64"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar orden o producto" className="pl-9" aria-label="Buscar orden o producto" /></div></CardHeader><CardContent className="overflow-x-auto"><div className="min-w-[680px]"><div className="grid grid-cols-[1fr_1.5fr_0.7fr_0.7fr_0.8fr] gap-4 border-b pb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground"><span>Orden</span><span>Artículos</span><span>Total</span><span>Utilidad</span><span>Estado</span></div>{filteredSales.map((sale) => <div key={sale.id} className="grid grid-cols-[1fr_1.5fr_0.7fr_0.7fr_0.8fr] items-center gap-4 border-b py-4 text-sm last:border-0"><div><p className="font-medium">{sale.id}</p><p className="text-xs text-muted-foreground">{sale.date}</p></div><span>{sale.items}</span><span className="font-medium">{money.format(sale.total)}</span><span className="text-primary">{money.format(sale.profit)}</span><Badge variant="secondary">{sale.status}</Badge></div>)}{filteredSales.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No se encontraron ventas.</p>}</div></CardContent><Separator /></Card>
        <div className="flex items-center gap-2 text-xs text-muted-foreground"><Package className="size-3.5" />Los datos se calculan a partir de órdenes de venta y movimientos registrados.</div>
      </div>
    </main>
  )
}
