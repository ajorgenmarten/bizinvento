import { JSX, useEffect, useRef, useState } from 'react'
import { Check, Minus, Package, Plus, Search, ShoppingCart, Trash2 } from 'lucide-react'
import { Badge } from '@renderer/components/ui/badge'
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
import { Separator } from '@renderer/components/ui/separator'
import { useFilterProduct } from '../warehouse/contexts/filter-products'
import Pagination from '@renderer/components/ux/pagination'
import { toast } from 'react-toastify'
import { Switch } from '@renderer/components/ui/switch'
import Layout from '@renderer/components/common/layout'

type Product = { id: string; name: string; slug: string; quantity: number; price: number }
type CartItem = Product & { count: number }

const money = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' })

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
  const canCompleteSale = receivedAmount >= subtotal

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
        setTimeout(() => setPaid(false), 1500)
      })
      .catch((err) => toast.error((err as Error).message))
  }

  useEffect(() => {
    document.title = 'BizInvento - POS'
  }, [])

  return (
    <Layout
      backButton
      title="Punto de venta"
      description="Registra una venta de forma rápida."
      icon={ShoppingCart}
      sideElement={
        <Badge variant="outline" className="hidden sm:flex">
          Caja · Abierta
        </Badge>
      }
    >
      <main className="min-h-screen px-4 py-6 md:px-8 md:py-8 dark:bg-black">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
          <div className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">
            <Card>
              <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Productos</CardTitle>
                  <CardDescription>
                    Selecciona un producto para añadirlo a la venta.
                  </CardDescription>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    ref={searchRef}
                    onChange={(event) => setSearch(event.target.value)}
                    className="pl-9"
                    placeholder="Buscar producto"
                    aria-label="Buscar producto"
                  />
                </div>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {products.result.map((product) => (
                  <button
                    type="button"
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="flex min-h-36 flex-col justify-between rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-primary hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex size-9 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                        <Package />
                      </span>
                      <Badge variant="secondary">{product.quantity} disponibles</Badge>
                    </div>
                    <div className="flex items-end justify-between gap-3">
                      <span className="font-medium leading-tight">{product.name}</span>
                      <span className="font-semibold">{product.price} $CUP</span>
                    </div>
                  </button>
                ))}
                <Pagination
                  page={products.page}
                  paginationSize={5}
                  totalItems={products.totalItems}
                  totalPages={products.totalPages}
                  onPageChange={setPage}
                />
                {products.result.length === 0 && (
                  <p className="col-span-full py-12 text-center text-sm text-muted-foreground">
                    No se encontraron productos.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="lg:sticky lg:top-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Venta actual</CardTitle>
                    <CardDescription>
                      {itemCount} {itemCount === 1 ? 'artículo' : 'artículos'}
                    </CardDescription>
                  </div>
                  <ShoppingCart className="text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                {paid && (
                  <div className="flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 p-3 text-sm">
                    <Check className="text-primary" /> Venta registrada correctamente.
                  </div>
                )}
                {cart.length === 0 && !paid ? (
                  <div className="flex flex-col items-center gap-2 py-12 text-center">
                    <ShoppingCart className="text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Tu carrito está vacío.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.price} $CUP c/u</p>
                          </div>
                          <p className="text-sm font-semibold">{item.price * item.count} $CUP</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center rounded-md border">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                              onClick={() => changeQuantity(item.id, -1)}
                              aria-label={`Disminuir ${item.name}`}
                            >
                              <Minus data-icon="inline-start" />
                            </Button>
                            <Input
                              type="number"
                              min="1"
                              max={item.quantity}
                              value={item.count}
                              onChange={(event) => setQuantity(item.id, event.target.value)}
                              className="h-8 w-14 rounded-none border-y-0 text-center text-sm"
                              aria-label={`Cantidad de ${item.name}`}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                              onClick={() => changeQuantity(item.id, 1)}
                              aria-label={`Aumentar ${item.name}`}
                            >
                              <Plus data-icon="inline-start" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setCart((current) =>
                                current.filter((cartItem) => cartItem.id !== item.id)
                              )
                            }
                            aria-label={`Eliminar ${item.name}`}
                          >
                            <Trash2 data-icon="inline-start" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {cart.length > 0 && (
                  <>
                    <Separator />
                    <div className="flex flex-col gap-2 text-sm">
                      <div className="flex items-center justify-between pt-2">
                        <span className="font-semibold">Total</span>
                        <span className="text-2xl font-semibold">{money.format(subtotal)}</span>
                      </div>
                    </div>
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={() => {
                        setCashReceived('')
                        setPaymentOpen(true)
                      }}
                    >
                      Cobrar {money.format(subtotal)}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar cobro</DialogTitle>
              <DialogDescription>
                Introduce el dinero recibido para calcular el cambio.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 ">
              <div className="flex items-center justify-between rounded-md bg-secondary p-4">
                <span className="text-sm text-muted-foreground">Total a cobrar</span>
                <span className="text-2xl font-semibold">{subtotal} $CUP</span>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="cash-received">Dinero recibido</Label>
                <Input
                  id="cash-received"
                  type="number"
                  min={subtotal}
                  step="0.01"
                  value={cashReceived}
                  onChange={(event) => setCashReceived(event.target.value)}
                  placeholder="0.00"
                  autoFocus
                />
              </div>
              <div className="flex items-center justify-between border-t pt-4">
                <span className="text-sm text-muted-foreground">Cambio a devolver</span>
                <span className="text-xl font-semibold">{change} $CUP</span>
              </div>
              <div className="flex items-center justify-between border-t pt-4">
                <Switch checked={payWithCard} onCheckedChange={(e) => setPayWithCard(e)} /> Pago por
                transferencia
              </div>
              {cashReceived && !canCompleteSale && (
                <p className="text-sm text-destructive">
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
      </main>
    </Layout>
  )
}
