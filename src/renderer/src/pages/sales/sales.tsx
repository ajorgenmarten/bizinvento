import { JSX, useEffect, useState } from 'react'
import { Link } from 'react-router'
import {
  Banknote,
  ChartColumnStacked,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  CreditCard,
  Package,
  ReceiptText,
  Search,
  ShoppingCart,
  TrendingUp
} from 'lucide-react'
import Layout from '@renderer/components/common/layout'
import { Badge } from '@renderer/components/ui/badge'
import { buttonVariants } from '@renderer/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@renderer/components/ui/card'
import { Input } from '@renderer/components/ui/input'
import { Separator } from '@renderer/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@renderer/components/ui/table'
import Pagination from '@renderer/components/ux/pagination'
import InfoCard from '@renderer/pages/warehouse/components/info-card'
import { cn } from '@renderer/lib/utils'
import { formatMoney, formatMoneyExact, formatNumber } from '@renderer/lib/format'
import { toast } from 'react-toastify'

type PaymentType = 'cash' | 'card'

type Order = {
  id: string
  totalPrice: number
  type: string
  paymentType: PaymentType
  createdAt: string
}

type Movement = {
  id: string
  productId: string
  productName: string
  currentPrice: number
  quantity: number
  orderId: string
}

type OrdersResponse = {
  results: Order[]
  totalItems: number
}

type SalesStats = {
  totalRevenue: number
  totalOrders: number
  totalUnits: number
  averageTicket: number
  cashRevenue: number
  cardRevenue: number
}

const PAGE_SIZE = 20
const emptyStats: SalesStats = {
  totalRevenue: 0,
  totalOrders: 0,
  totalUnits: 0,
  averageTicket: 0,
  cashRevenue: 0,
  cardRevenue: 0
}

const dateFormat = new Intl.DateTimeFormat('es-ES', {
  dateStyle: 'medium',
  timeStyle: 'short'
})

function formatDate(value: string): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : dateFormat.format(date)
}

function shortId(id: string): string {
  return `#${id.slice(0, 8).toUpperCase()}`
}

function paymentLabel(type: PaymentType): string {
  return type === 'card' ? 'Transferencia' : 'Efectivo'
}

export default function Sales(): JSX.Element {
  const [tab, setTab] = useState<'orders' | 'summary'>('orders')
  const [orders, setOrders] = useState<OrdersResponse>({ results: [], totalItems: 0 })
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [movements, setMovements] = useState<Movement[] | null>(null)
  const [stats, setStats] = useState<SalesStats>(emptyStats)

  useEffect(() => {
    document.title = 'BizInvento - Ventas'
  }, [])

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('sales:stats')
      .then((data: SalesStats) => setStats(data))
      .catch((error: Error) => toast.error(error.message))
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1)
      setDebouncedSearch(search)
    }, 250)
    return () => clearTimeout(timeout)
  }, [search])

  useEffect(() => {
    let cancelled = false
    window.electron.ipcRenderer
      .invoke('sales:orders', { page: page - 1, search: debouncedSearch || undefined })
      .then((data: OrdersResponse) => {
        if (cancelled) return
        setOrders(data)
        setSelectedId((current) =>
          current && data.results.some((order) => order.id === current)
            ? current
            : (data.results[0]?.id ?? null)
        )
      })
      .catch((error: Error) => {
        if (!cancelled) toast.error(error.message)
      })
      .finally(() => {
        if (!cancelled) setLoadingOrders(false)
      })
    return () => {
      cancelled = true
    }
  }, [page, debouncedSearch])

  useEffect(() => {
    if (!selectedId) return

    let cancelled = false
    window.electron.ipcRenderer
      .invoke('sales:get-movements-of-order', { orderId: selectedId })
      .then((data: Movement[]) => {
        if (!cancelled) setMovements(data)
      })
      .catch((error: Error) => {
        if (!cancelled) toast.error(error.message)
      })
    return () => {
      cancelled = true
    }
  }, [selectedId])

  const selectedOrder = orders.results.find((order) => order.id === selectedId) ?? null
  const totalPages = Math.max(1, Math.ceil(orders.totalItems / PAGE_SIZE))
  const paymentTotal = stats.cashRevenue + stats.cardRevenue
  const cashShare = paymentTotal ? (stats.cashRevenue / paymentTotal) * 100 : 0
  const cardShare = paymentTotal ? (stats.cardRevenue / paymentTotal) * 100 : 0
  const unitsPerOrder = stats.totalOrders ? stats.totalUnits / stats.totalOrders : 0

  const selectOrder = (id: string): void => {
    setSelectedId(id)
    setMovements(null)
  }

  const changePage = (next: number): void => {
    setLoadingOrders(true)
    setPage(next)
  }

  return (
    <Layout
      title="Ventas"
      description="Consulta el rendimiento de tu negocio y el detalle de cada venta."
      icon={ChartColumnStacked}
      sideElement={
        <Link to="/pos" className={buttonVariants({ variant: 'outline' })}>
          <ShoppingCart data-icon="inline-start" aria-hidden="true" />
          Ir al POS
        </Link>
      }
    >
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Resumen de ventas">
        <InfoCard
          info="Ingresos totales"
          value={formatMoney(stats.totalRevenue)}
          icon={CircleDollarSign}
        />
        <InfoCard info="Órdenes" value={formatNumber(stats.totalOrders)} icon={ClipboardList} />
        <InfoCard info="Unidades vendidas" value={formatNumber(stats.totalUnits)} icon={Package} />
        <InfoCard
          info="Ticket promedio"
          value={formatMoney(stats.averageTicket)}
          icon={TrendingUp}
        />
      </section>

      <div
        role="tablist"
        aria-label="Vistas de ventas"
        className="grid w-full max-w-sm grid-cols-2 rounded-lg bg-muted p-1"
      >
        <button
          type="button"
          role="tab"
          id="sales-tab-orders"
          aria-selected={tab === 'orders'}
          aria-controls="sales-panel-orders"
          onClick={() => setTab('orders')}
          className={cn(
            'inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60',
            tab === 'orders'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <ClipboardList className="size-4" aria-hidden="true" />
          Órdenes
        </button>
        <button
          type="button"
          role="tab"
          id="sales-tab-summary"
          aria-selected={tab === 'summary'}
          aria-controls="sales-panel-summary"
          onClick={() => setTab('summary')}
          className={cn(
            'inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60',
            tab === 'summary'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <TrendingUp className="size-4" aria-hidden="true" />
          Resumen
        </button>
      </div>

      {tab === 'orders' ? (
        <section
          id="sales-panel-orders"
          role="tabpanel"
          aria-labelledby="sales-tab-orders"
          className="flex flex-col gap-4"
        >
          <div>
            <h2 className="text-sm font-semibold tracking-tight">Órdenes recientes</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Selecciona una orden para revisar sus movimientos.
            </p>
          </div>

          <div className="grid items-start gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <Card className="gap-0 overflow-hidden bg-card/80">
              <CardHeader className="flex flex-col gap-4 pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle>Listado de órdenes</CardTitle>
                    <CardDescription>
                      {formatNumber(orders.totalItems)}{' '}
                      {orders.totalItems === 1 ? 'orden registrada' : 'órdenes registradas'}
                    </CardDescription>
                  </div>
                </div>
                <div className="relative">
                  <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Buscar por número de orden"
                    aria-label="Buscar orden"
                    className="pl-9"
                  />
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div
                  className={cn(
                    'flex flex-col divide-y divide-border/60 border-t border-border/60 transition-opacity',
                    loadingOrders && 'opacity-60'
                  )}
                >
                  {orders.results.map((order) => {
                    const active = selectedId === order.id
                    return (
                      <button
                        key={order.id}
                        type="button"
                        onClick={() => selectOrder(order.id)}
                        aria-pressed={active}
                        title={order.id}
                        className={cn(
                          'flex w-full items-center gap-3 px-5 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/60',
                          active ? 'bg-accent/60' : 'hover:bg-muted/40'
                        )}
                      >
                        <span
                          className={cn(
                            'grid size-9 shrink-0 place-items-center rounded-lg',
                            active ? 'bg-brand-soft text-brand' : 'bg-muted text-muted-foreground'
                          )}
                        >
                          <ReceiptText className="size-4" strokeWidth={1.75} aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="truncate text-sm font-medium tabular-nums">
                              {shortId(order.id)}
                            </span>
                            <Badge variant="secondary" className="shrink-0">
                              {paymentLabel(order.paymentType)}
                            </Badge>
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </span>
                        </span>
                        <span className="flex shrink-0 items-center gap-2">
                          <span className="text-sm font-semibold tabular-nums">
                            {formatMoney(order.totalPrice)}
                          </span>
                          <ChevronRight
                            className="size-4 text-muted-foreground"
                            aria-hidden="true"
                          />
                        </span>
                      </button>
                    )
                  })}

                  {!loadingOrders && orders.results.length === 0 && (
                    <div className="flex flex-col items-center gap-3 px-5 py-16 text-center">
                      <span className="grid size-11 place-items-center rounded-full bg-muted text-muted-foreground">
                        <ReceiptText className="size-4" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-sm font-medium">Sin órdenes</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {debouncedSearch
                            ? 'No se encontraron órdenes con ese número.'
                            : 'Registra una venta desde el punto de venta para verla aquí.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {loadingOrders && orders.results.length === 0 && (
                    <p className="px-5 py-16 text-center text-sm text-muted-foreground">
                      Cargando órdenes…
                    </p>
                  )}
                </div>

                <div className="px-5 py-3">
                  <Pagination
                    page={page}
                    paginationSize={5}
                    totalItems={orders.totalItems}
                    totalPages={totalPages}
                    itemsLabel="órdenes"
                    onPageChange={changePage}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="gap-4 bg-card/80">
              <CardHeader className="flex-row items-start justify-between gap-3">
                <div>
                  <CardTitle>
                    {selectedOrder ? `Detalle ${shortId(selectedOrder.id)}` : 'Detalle de la orden'}
                  </CardTitle>
                  <CardDescription>
                    {selectedOrder
                      ? `${formatDate(selectedOrder.createdAt)} · ${paymentLabel(selectedOrder.paymentType)}`
                      : 'Selecciona una orden de la lista.'}
                  </CardDescription>
                </div>
                {selectedOrder && (
                  <Badge variant="outline" className="shrink-0 tabular-nums">
                    {formatMoneyExact(selectedOrder.totalPrice)}
                  </Badge>
                )}
              </CardHeader>

              <CardContent className="flex flex-col gap-4">
                {!selectedOrder ? (
                  <div className="flex flex-col items-center gap-3 py-14 text-center">
                    <span className="grid size-11 place-items-center rounded-full border border-dashed border-border text-muted-foreground">
                      <ClipboardList className="size-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">Ninguna orden seleccionada</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Elige una orden para ver sus productos.
                      </p>
                    </div>
                  </div>
                ) : movements === null ? (
                  <p className="py-14 text-center text-sm text-muted-foreground">
                    Cargando movimientos…
                  </p>
                ) : movements.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-border/70 py-12 text-center text-sm text-muted-foreground">
                    Esta orden no tiene movimientos registrados.
                  </p>
                ) : (
                  <>
                    <div className="overflow-hidden rounded-xl border border-border/60">
                      <Table>
                        <TableHeader className="bg-muted/30">
                          <TableRow className="border-0 hover:bg-transparent">
                            <TableHead className="h-9 px-4 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                              Producto
                            </TableHead>
                            <TableHead className="h-9 px-4 text-center text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                              Cantidad
                            </TableHead>
                            <TableHead className="h-9 px-4 text-right text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                              Importe
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {movements.map((movement) => (
                            <TableRow
                              key={movement.id}
                              className="border-border/50 hover:bg-muted/30"
                            >
                              <TableCell className="max-w-[220px] truncate px-4 py-3 font-medium">
                                {movement.productName}
                              </TableCell>
                              <TableCell className="px-4 py-3 text-center tabular-nums">
                                {formatNumber(movement.quantity)}
                              </TableCell>
                              <TableCell className="px-4 py-3 text-right">
                                <span className="block text-sm font-medium tabular-nums">
                                  {formatMoney(movement.currentPrice * movement.quantity)}
                                </span>
                                <span className="block text-[11px] text-muted-foreground tabular-nums">
                                  {formatMoney(movement.currentPrice)} c/u
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total de la orden</span>
                      <span className="text-xl font-semibold tabular-nums">
                        {formatMoneyExact(selectedOrder.totalPrice)}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      ) : (
        <section
          id="sales-panel-summary"
          role="tabpanel"
          aria-labelledby="sales-tab-summary"
          className="flex flex-col gap-4"
        >
          <div>
            <h2 className="text-sm font-semibold tracking-tight">Resumen de ventas</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Indicadores calculados a partir de todas las ventas registradas.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="bg-card/80">
              <CardHeader>
                <CardTitle>Métodos de pago</CardTitle>
                <CardDescription>Distribución de los ingresos por forma de cobro.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-sm font-medium">
                      <span className="grid size-7 place-items-center rounded-md bg-brand-soft text-brand">
                        <Banknote className="size-3.5" aria-hidden="true" />
                      </span>
                      Efectivo
                    </span>
                    <span className="text-sm font-semibold tabular-nums">
                      {formatMoney(stats.cashRevenue)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-brand"
                      style={{ width: `${cashShare}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground tabular-nums">
                    {cashShare.toFixed(1)}% de los ingresos
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-sm font-medium">
                      <span className="grid size-7 place-items-center rounded-md bg-muted text-muted-foreground">
                        <CreditCard className="size-3.5" aria-hidden="true" />
                      </span>
                      Transferencia
                    </span>
                    <span className="text-sm font-semibold tabular-nums">
                      {formatMoney(stats.cardRevenue)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-foreground/60"
                      style={{ width: `${cardShare}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground tabular-nums">
                    {cardShare.toFixed(1)}% de los ingresos
                  </p>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Ingresos totales</span>
                  <span className="text-lg font-semibold tabular-nums">
                    {formatMoneyExact(paymentTotal)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-4">
              <Card className="bg-card/80">
                <CardHeader>
                  <CardDescription>Ticket promedio</CardDescription>
                  <CardTitle className="text-3xl tabular-nums">
                    {formatMoneyExact(stats.averageTicket)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Importe promedio por orden de venta.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/80">
                <CardHeader>
                  <CardDescription>Artículos por orden</CardDescription>
                  <CardTitle className="text-3xl tabular-nums">
                    {unitsPerOrder.toFixed(1)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Promedio de unidades vendidas en cada orden.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}
    </Layout>
  )
}
