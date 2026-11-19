'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Package,
  Pencil,
  Search,
  ShoppingCart,
  Trash2,
  TrendingUp,
  X
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type Movement = { id: string; product: string; quantity: number; price: number }
type Order = { id: string; date: string; status: string; movements: Movement[] }

const currency = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' })
const initialOrders: Order[] = [
  {
    id: 'ORD-1048',
    date: 'Hoy, 14:32',
    status: 'Completada',
    movements: [
      { id: 'm-1048-1', product: 'Café molido', quantity: 2, price: 18.5 },
      { id: 'm-1048-2', product: 'Leche entera', quantity: 1, price: 5.5 }
    ]
  },
  {
    id: 'ORD-1047',
    date: 'Hoy, 13:18',
    status: 'Completada',
    movements: [
      { id: 'm-1047-1', product: 'Arroz', quantity: 3, price: 12.25 },
      { id: 'm-1047-2', product: 'Aceite', quantity: 1, price: 19.5 },
      { id: 'm-1047-3', product: 'Azúcar', quantity: 2, price: 6.25 }
    ]
  },
  {
    id: 'ORD-1046',
    date: 'Hoy, 11:06',
    status: 'Completada',
    movements: [{ id: 'm-1046-1', product: 'Pan artesanal', quantity: 2, price: 9 }]
  },
  {
    id: 'ORD-1045',
    date: 'Ayer, 19:44',
    status: 'Completada',
    movements: [
      { id: 'm-1045-1', product: 'Café molido', quantity: 1, price: 18.5 },
      { id: 'm-1045-2', product: 'Pan artesanal', quantity: 2, price: 9 }
    ]
  }
]

const orderTotal = (order: Order) =>
  order.movements.reduce((total, movement) => total + movement.price * movement.quantity, 0)
const itemCount = (order: Order) =>
  order.movements.reduce((total, movement) => total + movement.quantity, 0)

export function SalesScreen() {
  const [orders, setOrders] = useState(initialOrders)
  const [selectedOrderId, setSelectedOrderId] = useState(initialOrders[0]?.id ?? null)
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(false)
  const [draftMovements, setDraftMovements] = useState<Movement[]>(
    initialOrders[0]?.movements ?? []
  )
  const [deleteOrderPending, setDeleteOrderPending] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<'order' | string | null>(null)

  const selectedOrder = orders.find((order) => order.id === selectedOrderId) ?? null
  const filteredOrders = useMemo(
    () =>
      orders.filter((order) =>
        `${order.id} ${order.date}`.toLowerCase().includes(query.toLowerCase())
      ),
    [orders, query]
  )
  const draftTotal = draftMovements.reduce(
    (total, movement) => total + movement.price * movement.quantity,
    0
  )
  const hasChanges = Boolean(
    selectedOrder &&
    (deleteOrderPending ||
      JSON.stringify(draftMovements) !== JSON.stringify(selectedOrder.movements))
  )

  const selectOrder = (order: Order) => {
    setSelectedOrderId(order.id)
    setDraftMovements(order.movements.map((movement) => ({ ...movement })))
    setDeleteOrderPending(false)
    setEditing(false)
  }

  const updateQuantity = (movementId: string, value: string) => {
    const quantity = Number(value)
    if (!Number.isFinite(quantity) || quantity <= 0) return
    setDraftMovements((current) =>
      current.map((movement) => (movement.id === movementId ? { ...movement, quantity } : movement))
    )
  }

  const removeDraftMovement = (movementId: string) => {
    setDraftMovements((current) => current.filter((movement) => movement.id !== movementId))
  }

  const applyChanges = () => {
    if (!selectedOrderId) return
    if (deleteOrderPending) {
      const remaining = orders.filter((order) => order.id !== selectedOrderId)
      setOrders(remaining)
      setSelectedOrderId(remaining[0]?.id ?? null)
      setDraftMovements(remaining[0]?.movements.map((movement) => ({ ...movement })) ?? [])
    } else {
      setOrders((current) =>
        current.map((order) =>
          order.id === selectedOrderId ? { ...order, movements: draftMovements } : order
        )
      )
    }
    setDeleteOrderPending(false)
    setEditing(false)
  }

  const cancelChanges = () => {
    if (selectedOrder)
      setDraftMovements(selectedOrder.movements.map((movement) => ({ ...movement })))
    setDeleteOrderPending(false)
    setEditing(false)
  }

  const confirmRemoval = () => {
    if (confirmDelete === 'order') {
      setDeleteOrderPending(true)
      setDraftMovements([])
    } else if (confirmDelete) {
      removeDraftMovement(confirmDelete)
    }
    setConfirmDelete(null)
  }

  const totalSales = orders.reduce((total, order) => total + orderTotal(order), 0)
  const totalUnits = orders.reduce((total, order) => total + itemCount(order), 0)
  const averageTicket = orders.length ? totalSales / orders.length : 0

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className={buttonVariants({ variant: 'outline', size: 'icon' })}
              aria-label="Volver al panel principal"
            >
              <ArrowLeft />
            </Link>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Gestión comercial
              </p>
              <h1 className="text-2xl font-semibold tracking-tight">Ventas</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/pos" className={buttonVariants({ variant: 'outline' })}>
              <ShoppingCart data-icon="inline-start" />
              Ir al POS
            </Link>
            <Button variant="outline">
              <CalendarDays data-icon="inline-start" />
              Exportar
            </Button>
          </div>
        </header>

        <Tabs defaultValue="orders" className="flex flex-col gap-5">
          <TabsList className="grid h-auto w-full max-w-md grid-cols-2">
            <TabsTrigger value="orders">
              <ClipboardList data-icon="inline-start" />
              Órdenes
            </TabsTrigger>
            <TabsTrigger value="summary">
              <TrendingUp data-icon="inline-start" />
              Resumen
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="flex flex-col gap-5">
            <div>
              <h2 className="text-lg font-medium">Órdenes recientes</h2>
              <p className="text-sm text-muted-foreground">
                Selecciona una orden para revisar y editar sus movimientos.
              </p>
            </div>
            <div className="grid items-start gap-5 xl:grid-cols-[0.9fr_1.1fr]">
              <Card>
                <CardHeader className="gap-4">
                  <div>
                    <CardTitle>Listado de órdenes</CardTitle>
                    <CardDescription>{orders.length} órdenes registradas</CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Buscar por número de orden"
                      aria-label="Buscar orden"
                      className="pl-9"
                    />
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {filteredOrders.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      No se encontraron órdenes.
                    </p>
                  ) : (
                    filteredOrders.map((order) => {
                      const active = selectedOrderId === order.id
                      return (
                        <button
                          key={order.id}
                          type="button"
                          onClick={() => selectOrder(order)}
                          className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors ${active ? 'border-primary bg-accent/50' : 'hover:bg-muted/50'}`}
                          aria-pressed={active}
                        >
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary">
                            <ShoppingCart className="size-4 text-muted-foreground" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{order.id}</p>
                              <Badge variant="secondary">{order.status}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {order.date} · {itemCount(order)} artículos
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{currency.format(orderTotal(order))}</p>
                            <ChevronRight className="ml-auto size-4 text-muted-foreground" />
                          </div>
                        </button>
                      )
                    })
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex-row items-start justify-between gap-3">
                  <div>
                    <CardTitle>
                      {selectedOrder ? `Movimientos · ${selectedOrder.id}` : 'Detalle de orden'}
                    </CardTitle>
                    <CardDescription>
                      {selectedOrder
                        ? `${selectedOrder.date} · ${draftMovements.length} ${draftMovements.length === 1 ? 'movimiento' : 'movimientos'}`
                        : 'Selecciona una orden de la lista.'}
                    </CardDescription>
                  </div>
                  {selectedOrder && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setConfirmDelete('order')}
                      disabled={deleteOrderPending}
                    >
                      <Trash2 data-icon="inline-start" />
                      Eliminar orden
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {!selectedOrder ? (
                    <p className="py-10 text-center text-sm text-muted-foreground">
                      Selecciona una orden para ver sus movimientos.
                    </p>
                  ) : (
                    <>
                      {deleteOrderPending && (
                        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                          Esta orden se eliminará al aplicar los cambios.
                        </div>
                      )}
                      {draftMovements.length === 0 ? (
                        <p className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
                          No hay movimientos en esta orden.
                        </p>
                      ) : (
                        <div className="flex flex-col gap-3">
                          <div className="hidden grid-cols-[minmax(0,1fr)_100px_100px_40px] gap-3 px-3 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:grid">
                            <span>Producto</span>
                            <span>Cantidad</span>
                            <span className="text-right">Importe</span>
                            <span />
                          </div>
                          {draftMovements.map((movement) => (
                            <div
                              key={movement.id}
                              className="grid grid-cols-[minmax(0,1fr)_88px_36px] items-center gap-2 rounded-lg border p-3 sm:grid-cols-[minmax(0,1fr)_100px_100px_40px] sm:gap-3"
                            >
                              <div className="min-w-0">
                                <p className="truncate font-medium">{movement.product}</p>
                                <p className="text-xs text-muted-foreground">
                                  {currency.format(movement.price)} / unidad
                                </p>
                              </div>
                              <Input
                                type="number"
                                inputMode="decimal"
                                min="0.01"
                                step="any"
                                value={movement.quantity}
                                aria-label={`Cantidad de ${movement.product}`}
                                readOnly={!editing || deleteOrderPending}
                                onChange={(event) =>
                                  updateQuantity(movement.id, event.target.value)
                                }
                                className="h-9"
                              />
                              <p className="col-start-2 text-xs text-muted-foreground sm:col-start-auto sm:hidden">
                                Importe
                              </p>
                              <p className="hidden text-right text-sm font-medium sm:block">
                                {currency.format(movement.price * movement.quantity)}
                              </p>
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label={`Eliminar movimiento de ${movement.product}`}
                                onClick={() => setConfirmDelete(movement.id)}
                                disabled={deleteOrderPending}
                              >
                                <Trash2 />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total de la orden</span>
                        <span className="text-xl font-semibold">{currency.format(draftTotal)}</span>
                      </div>
                      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
                        <Button variant="outline" onClick={cancelChanges} disabled={!hasChanges}>
                          <X data-icon="inline-start" />
                          Cancelar
                        </Button>
                        <div className="flex flex-col gap-2 sm:flex-row">
                          {!editing && (
                            <Button
                              variant="outline"
                              onClick={() => setEditing(true)}
                              disabled={deleteOrderPending}
                            >
                              <Pencil data-icon="inline-start" />
                              Modificar cantidades
                            </Button>
                          )}
                          <Button onClick={applyChanges} disabled={!hasChanges}>
                            <Check data-icon="inline-start" />
                            Aplicar cambios
                          </Button>
                        </div>
                      </div>
                      {editing && (
                        <p className="text-xs text-muted-foreground">
                          Edita las cantidades y aplica los cambios para guardar. Las cantidades
                          deben ser mayores que cero.
                        </p>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="summary" className="flex flex-col gap-5">
            <div>
              <h2 className="text-lg font-medium">Resumen de ventas</h2>
              <p className="text-sm text-muted-foreground">
                Indicadores calculados a partir de las órdenes actuales.
              </p>
            </div>
            <section className="grid gap-4 sm:grid-cols-3" aria-label="Resumen de ventas">
              <Card>
                <CardHeader className="flex-row items-center justify-between pb-2">
                  <CardDescription>Ingresos totales</CardDescription>
                  <CircleDollarSign className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold">{currency.format(totalSales)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex-row items-center justify-between pb-2">
                  <CardDescription>Órdenes</CardDescription>
                  <ClipboardList className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold">{orders.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex-row items-center justify-between pb-2">
                  <CardDescription>Unidades vendidas</CardDescription>
                  <Package className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold">{totalUnits}</p>
                </CardContent>
              </Card>
              <Card className="sm:col-span-3">
                <CardHeader>
                  <CardTitle>Ticket promedio</CardTitle>
                  <CardDescription>Importe promedio por orden registrada</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold">{currency.format(averageTicket)}</p>
                </CardContent>
              </Card>
            </section>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog
        open={confirmDelete !== null}
        onOpenChange={(open) => !open && setConfirmDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmDelete === 'order' ? '¿Eliminar esta orden?' : '¿Eliminar este movimiento?'}
            </DialogTitle>
            <DialogDescription>
              {confirmDelete === 'order'
                ? 'La orden y todos sus movimientos se quitarán cuando apliques los cambios. Esta acción no se puede deshacer después de aplicar.'
                : 'El movimiento se quitará de la orden. El cambio se guardará cuando apliques los cambios.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmRemoval}>
              <Trash2 data-icon="inline-start" />
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
