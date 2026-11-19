import { JSX, useEffect, useRef, useState } from 'react'
import { CheckCircle2, Minus, Package, Plus, Search, ShoppingCart, Trash2 } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@renderer/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@renderer/components/ui/dialog'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import { Switch } from '@renderer/components/ui/switch'
import { useFilterProduct } from '../warehouse/contexts/filter-products'
import Pagination from '@renderer/components/ux/pagination'
import { toast } from 'react-toastify'
import Layout from '@renderer/components/common/layout'
import { cn } from '@renderer/lib/utils'
import { formatMoney, formatNumber } from '@renderer/lib/format'

type Product = { id: string; name: string; slug: string; quantity: number; price: number }
type CartItem = Product & { count: number }

export default function POS(): JSX.Element {
  const { products, setSearch, setPage, refresh } = useFilterProduct()
  const [cart, setCart] = useState<CartItem[]>([])
  const [payWithCard, setPayWithCard] = useState(false)

  const searchRef = useRef<HTMLInputElement | null>(null)

  const [paymentOpen, setPaymentOpen] = useState(false)
  const [cashReceived, setCashReceived] = useState('')
  const [paid, setPaid] = useState(false)

  const itemCount = cart.reduce((sum, item) => sum + item.count, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.count, 0)

  function addToCart(product: Product): void {
    if (product.quantity <= 0) return
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id)
      if (existing)
        return current.map((item) =>
          item.id === product.id
            ? { ...item, count: Math.min(item.count + 1, product.quantity) }
            : item
        )
      return [...current, { ...product, count: 1 }]
    })
    setPaid(false)
  }

  function changeQuantity(id: string, amount: number): void {
    setCart((current) =>
      current.flatMap((item) => {
        if (item.id !== id) return [item]
        const count = item.count + amount
        return count > 0 ? [{ ...item, count: Math.min(count, item.quantity) }] : []
      })
    )
  }

  function setQuantity(id: string, value: string): void {
    const nextCount = Number.parseInt(value, 10)
    if (!Number.isFinite(nextCount)) return
    setCart((current) =>
      current.flatMap((item) => {
        if (item.id !== id) return [item]
        const count = Math.min(Math.max(nextCount, 0), item.quantity)
        return count > 0 ? [{ ...item, count }] : []
      })
    )
  }

  const receivedAmount = Number.parseFloat(cashReceived.replace(',', '.')) || 0
  const change = Math.max(receivedAmount - subtotal, 0)
  const canCompleteSale = payWithCard || receivedAmount >= subtotal

  function completeSale(): void {
    if (!canCompleteSale) return
    window.electron.ipcRenderer
      .invoke('pos:sale', { items: cart, paymentType: payWithCard ? 'card' : 'cash' })
      .then(() => {
        setPaymentOpen(false)
        setPayWithCard(false)
        setPaid(true)
        setCart([])
        refresh().then(() => {
          if (searchRef.current) searchRef.current.value = ''
        })
        setTimeout(() => setPaid(false), 2500)
      })
      .catch((err) => toast.error((err as Error).message))
  }

  useEffect(() => {
    document.title = 'BizInvento - POS'
  }, [])

  return (
    <Layout
      title="Punto de venta"
      description="Registra una venta de forma rápida y sencilla."
      icon={ShoppingCart}
      sideElement={
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
          <span className="size-1.5 rounded-full bg-brand" />
          Caja abierta
        </span>
      }
    >
      <div className="grid items-start gap-6 md:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
        <section aria-label="Productos" className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">Productos</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {formatNumber(products.totalItems)} disponibles en inventario
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                ref={searchRef}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
                placeholder="Buscar producto"
                aria-label="Buscar producto"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.result.map((product) => {
              const outOfStock = product.quantity <= 0
              const lowStock = !outOfStock && product.quantity <= 10
              return (
                <button
                  type="button"
                  key={product.id}
                  onClick={() => addToCart(product)}
                  disabled={outOfStock}
                  aria-label={`Añadir ${product.name}`}
                  className={cn(
                    'group flex flex-col gap-4 rounded-xl border border-border/70 bg-card/50 p-4 text-left transition-all duration-200',
                    'hover:-translate-y-0.5 hover:border-foreground/15 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60',
                    'disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 disabled:hover:border-border/70 disabled:hover:bg-card/50'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="grid size-9 place-items-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:text-foreground">
                      <Package className="size-4" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span
                      className={cn(
                        'rounded-full border px-2 py-0.5 text-[11px] font-medium tabular-nums',
                        outOfStock
                          ? 'border-destructive/20 bg-destructive/10 text-destructive'
                          : lowStock
                            ? 'border-warning/25 bg-warning/10 text-warning'
                            : 'border-border/70 text-muted-foreground'
                      )}
                    >
                      {outOfStock ? 'Agotado' : `${formatNumber(product.quantity)} disp.`}
                    </span>
                  </div>
                  <div className="flex items-end justify-between gap-3">
                    <span className="line-clamp-2 text-sm font-medium leading-snug">
                      {product.name}
                    </span>
                    <span className="shrink-0 text-sm font-semibold tabular-nums">
                      {formatMoney(product.price)}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {products.result.length === 0 && (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border/70 py-16 text-center">
              <span className="grid size-11 place-items-center rounded-full bg-muted text-muted-foreground">
                <Search className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium">Sin resultados</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Prueba con otro nombre de producto.
                </p>
              </div>
            </div>
          )}

          <Pagination
            page={products.page}
            paginationSize={5}
            totalItems={products.totalItems}
            totalPages={products.totalPages}
            onPageChange={setPage}
          />
        </section>

        <aside className="lg:sticky lg:top-24">
          <Card className="gap-4 bg-card/80">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>Venta actual</CardTitle>
                  <CardDescription>
                    {itemCount} {itemCount === 1 ? 'artículo' : 'artículos'}
                  </CardDescription>
                </div>
                <span className="grid size-9 place-items-center rounded-lg bg-muted text-muted-foreground">
                  <ShoppingCart className="size-4" strokeWidth={1.75} aria-hidden="true" />
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {paid && (
                <div className="flex items-center gap-2 rounded-xl border border-brand/25 bg-brand-soft px-3 py-2.5 text-sm text-brand">
                  <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
                  Venta registrada correctamente.
                </div>
              )}

              {cart.length === 0 && !paid ? (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <span className="grid size-12 place-items-center rounded-full border border-dashed border-border text-muted-foreground">
                    <ShoppingCart className="size-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">Carrito vacío</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Añade productos para comenzar.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatMoney(item.price)} c/u
                          </p>
                        </div>
                        <p className="shrink-0 text-sm font-semibold tabular-nums">
                          {formatMoney(item.price * item.count)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center rounded-lg border border-border/70 bg-background/40">
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => changeQuantity(item.id, -1)}
                            aria-label={`Disminuir ${item.name}`}
                          >
                            <Minus aria-hidden="true" />
                          </Button>
                          <input
                            type="number"
                            min="1"
                            max={item.quantity}
                            value={item.count}
                            onChange={(event) => setQuantity(item.id, event.target.value)}
                            className="h-7 w-9 border-0 bg-transparent text-center text-xs tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            aria-label={`Cantidad de ${item.name}`}
                          />
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => changeQuantity(item.id, 1)}
                            aria-label={`Aumentar ${item.name}`}
                          >
                            <Plus aria-hidden="true" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          onClick={() =>
                            setCart((current) =>
                              current.filter((cartItem) => cartItem.id !== item.id)
                            )
                          }
                          aria-label={`Eliminar ${item.name}`}
                        >
                          <Trash2 className="size-3.5" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {cart.length > 0 && (
                <div className="flex flex-col gap-4 border-t border-border/70 pt-4">
                  <div className="flex items-end justify-between">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="text-2xl font-semibold tabular-nums">
                      {formatMoney(subtotal)}
                    </span>
                  </div>
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => {
                      setCashReceived('')
                      setPaymentOpen(true)
                    }}
                  >
                    Cobrar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>

      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar cobro</DialogTitle>
            <DialogDescription>
              {payWithCard
                ? 'Confirma el cobro por transferencia.'
                : 'Introduce el dinero recibido para calcular el cambio.'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/40 px-4 py-3">
              <span className="text-sm text-muted-foreground">Total a cobrar</span>
              <span className="text-xl font-semibold tabular-nums">{formatMoney(subtotal)}</span>
            </div>

            {!payWithCard && (
              <>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="cash-received">Dinero recibido</Label>
                    <button
                      type="button"
                      onClick={() => setCashReceived(String(subtotal))}
                      className="rounded text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                    >
                      Exacto
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="cash-received"
                      type="number"
                      min={subtotal}
                      step="0.01"
                      value={cashReceived}
                      onChange={(event) => setCashReceived(event.target.value)}
                      placeholder="0.00"
                      autoFocus
                      className="h-11 pr-14 text-base font-medium tabular-nums"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                      $CUP
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-border/70 pt-4">
                  <span className="text-sm text-muted-foreground">Cambio a devolver</span>
                  <span
                    className={cn(
                      'text-lg font-semibold tabular-nums',
                      change > 0 ? 'text-brand' : 'text-foreground'
                    )}
                  >
                    {formatMoney(change)}
                  </span>
                </div>
              </>
            )}

            <div className="flex items-center justify-between gap-4 rounded-xl border border-border/70 px-4 py-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">Pago por transferencia</span>
                <span className="text-xs text-muted-foreground">No se calcula cambio.</span>
              </div>
              <Switch
                checked={payWithCard}
                onCheckedChange={(checked) => setPayWithCard(checked)}
                aria-label="Pago por transferencia"
              />
            </div>

            {!payWithCard && cashReceived && !canCompleteSale && (
              <p className="text-xs text-destructive">
                El dinero recibido debe ser igual o mayor al total.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={completeSale} disabled={!canCompleteSale}>
              Confirmar venta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  )
}
