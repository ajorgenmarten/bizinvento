
'use client'

import { useMemo, useState } from 'react'
import { ArrowLeft, Check, Minus, Package, Plus, Search, ShoppingCart, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

type Product = { id: number; name: string; quantity: number; price: number }
type CartItem = Product & { count: number }

const products: Product[] = [
  { id: 1, name: 'Teclado inalámbrico', quantity: 24, price: 29.9 },
  { id: 2, name: 'Mouse ergonómico', quantity: 18, price: 21.5 },
  { id: 3, name: 'Hub USB-C', quantity: 7, price: 34 },
  { id: 4, name: 'Base para laptop', quantity: 12, price: 42.9 },
  { id: 5, name: 'Audífonos compactos', quantity: 31, price: 18.75 },
  { id: 6, name: 'Cable USB-C 2m', quantity: 45, price: 9.9 },
]

const money = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' })

export function PosScreen() {
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState<CartItem[]>([
    { ...products[0], count: 1 },
    { ...products[2], count: 2 },
  ])
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [cashReceived, setCashReceived] = useState('')
  const [paid, setPaid] = useState(false)

  const filteredProducts = useMemo(
    () => products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  )
  const itemCount = cart.reduce((sum, item) => sum + item.count, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.count, 0)
  const tax = subtotal * 0.18
  const total = subtotal + tax

  function addToCart(product: Product) {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id)
      if (existing) return current.map((item) => item.id === product.id ? { ...item, count: Math.min(item.count + 1, product.quantity) } : item)
      return [...current, { ...product, count: 1 }]
    })
    setPaid(false)
  }

  function changeQuantity(id: number, amount: number) {
    setCart((current) => current.flatMap((item) => {
      if (item.id !== id) return [item]
      const count = item.count + amount
      return count > 0 ? [{ ...item, count: Math.min(count, item.quantity) }] : []
    }))
  }

  function setQuantity(id: number, value: string) {
    const nextCount = Number.parseInt(value, 10)
    if (!Number.isFinite(nextCount)) return
    setCart((current) => current.flatMap((item) => {
      if (item.id !== id) return [item]
      const count = Math.min(Math.max(nextCount, 0), item.quantity)
      return count > 0 ? [{ ...item, count }] : []
    }))
  }

  const receivedAmount = Number.parseFloat(cashReceived.replace(',', '.')) || 0
  const change = Math.max(receivedAmount - total, 0)
  const canCompleteSale = receivedAmount >= total

  function completeSale() {
    if (!canCompleteSale) return
    setPaymentOpen(false)
    setPaid(true)
    setCart([])
  }

  return (
    <main className="min-h-screen px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon" aria-label="Volver al panel principal">
              <a href="/"><ArrowLeft data-icon="inline-start" /></a>
            </Button>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-muted-foreground"><ShoppingCart data-icon="inline-start" /><span className="text-xs font-medium uppercase tracking-[0.18em]">Módulo</span></div>
              <h1 className="text-3xl font-semibold tracking-tight">Punto de venta</h1>
              <p className="text-sm text-muted-foreground">Registra una venta de forma rápida.</p>
            </div>
          </div>
          <Badge variant="outline" className="hidden sm:flex">Caja 01 · Abierta</Badge>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">
          <Card>
            <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div><CardTitle>Productos</CardTitle><CardDescription>Selecciona un producto para añadirlo a la venta.</CardDescription></div>
              <div className="relative w-full sm:w-64"><Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" placeholder="Buscar producto" aria-label="Buscar producto" /></div>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => <button type="button" key={product.id} onClick={() => addToCart(product)} className="flex min-h-36 flex-col justify-between rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-primary hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><div className="flex items-start justify-between gap-3"><span className="flex size-9 items-center justify-center rounded-md bg-secondary text-muted-foreground"><Package /></span><Badge variant="secondary">{product.quantity} disponibles</Badge></div><div className="flex items-end justify-between gap-3"><span className="font-medium leading-tight">{product.name}</span><span className="font-semibold">{money.format(product.price)}</span></div></button>)}
              {filteredProducts.length === 0 && <p className="col-span-full py-12 text-center text-sm text-muted-foreground">No se encontraron productos.</p>}
            </CardContent>
          </Card>

          <Card className="lg:sticky lg:top-6">
            <CardHeader><div className="flex items-center justify-between"><div><CardTitle>Venta actual</CardTitle><CardDescription>{itemCount} {itemCount === 1 ? 'artículo' : 'artículos'}</CardDescription></div><ShoppingCart className="text-muted-foreground" /></div></CardHeader>
            <CardContent className="flex flex-col gap-5">
              {paid && <div className="flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 p-3 text-sm"><Check className="text-primary" /> Venta registrada correctamente.</div>}
              {cart.length === 0 && !paid ? <div className="flex flex-col items-center gap-2 py-12 text-center"><ShoppingCart className="text-muted-foreground" /><p className="text-sm text-muted-foreground">Tu carrito está vacío.</p></div> : <div className="flex flex-col gap-4">{cart.map((item) => <div key={item.id} className="flex flex-col gap-2"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-medium">{item.name}</p><p className="text-xs text-muted-foreground">{money.format(item.price)} c/u</p></div><p className="text-sm font-semibold">{money.format(item.price * item.count)}</p></div><div className="flex items-center justify-between"><div className="flex items-center rounded-md border"><Button variant="ghost" size="icon" className="size-8" onClick={() => changeQuantity(item.id, -1)} aria-label={`Disminuir ${item.name}`}><Minus data-icon="inline-start" /></Button><Input type="number" min="1" max={item.quantity} value={item.count} onChange={(event) => setQuantity(item.id, event.target.value)} className="h-8 w-14 rounded-none border-y-0 text-center text-sm" aria-label={`Cantidad de ${item.name}`} /><Button variant="ghost" size="icon" className="size-8" onClick={() => changeQuantity(item.id, 1)} aria-label={`Aumentar ${item.name}`}><Plus data-icon="inline-start" /></Button></div><Button variant="ghost" size="icon" onClick={() => setCart((current) => current.filter((cartItem) => cartItem.id !== item.id))} aria-label={`Eliminar ${item.name}`}><Trash2 data-icon="inline-start" /></Button></div></div>)}</div>}
              {cart.length > 0 && <><Separator /><div className="flex flex-col gap-2 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{money.format(subtotal)}</span></div><div className="flex justify-between"><span className="text-muted-foreground">IVA (18%)</span><span>{money.format(tax)}</span></div><div className="flex items-center justify-between pt-2"><span className="font-semibold">Total</span><span className="text-2xl font-semibold">{money.format(total)}</span></div></div><Button size="lg" className="w-full" onClick={() => { setCashReceived(''); setPaymentOpen(true) }}>Cobrar {money.format(total)}</Button></>}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirmar cobro</DialogTitle><DialogDescription>Introduce el dinero recibido para calcular el cambio.</DialogDescription></DialogHeader>
          <div className="flex flex-col gap-4"><div className="flex items-center justify-between rounded-md bg-secondary p-4"><span className="text-sm text-muted-foreground">Total a cobrar</span><span className="text-2xl font-semibold">{money.format(total)}</span></div><div className="flex flex-col gap-2"><Label htmlFor="cash-received">Dinero recibido</Label><Input id="cash-received" type="number" min={total} step="0.01" value={cashReceived} onChange={(event) => setCashReceived(event.target.value)} placeholder="0.00" autoFocus /></div><div className="flex items-center justify-between border-t pt-4"><span className="text-sm text-muted-foreground">Cambio a devolver</span><span className="text-xl font-semibold">{money.format(change)}</span></div>{cashReceived && !canCompleteSale && <p className="text-sm text-destructive">El dinero recibido debe ser igual o mayor al total.</p>}</div>
          <DialogFooter><Button variant="outline" onClick={() => setPaymentOpen(false)}>Cancelar</Button><Button onClick={completeSale} disabled={!canCompleteSale}>Confirmar venta</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
