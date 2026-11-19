import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@renderer/components/ui/card'
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table as TableUI
} from '@renderer/components/ui/table'
import { Input } from '@renderer/components/ui/input'
import { House, PackagePlus, PackageSearch, Pencil, Search, Trash2 } from 'lucide-react'
import { JSX } from 'react/jsx-runtime'
import { useFilterProduct } from '../contexts/filter-products'
import Pagination from '@renderer/components/ux/pagination'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@renderer/components/ui/dialog'
import { Label } from '@renderer/components/ui/label'
import FormError from '@renderer/components/ux/form-error'
import { Button } from '@renderer/components/ui/button'
import useEditProductModal from '../hooks/useEditProductModal'
import useDeleteProductModal from '../hooks/useDeleteProductModal'
import useAddMoreProductModal from '../hooks/useAddMoreProductModal'
import useHouseAccountModal from '../hooks/useHouseAccountModal'
import { cn } from '@renderer/lib/utils'
import { formatMoney, formatNumber } from '@renderer/lib/format'

export default function Table(): JSX.Element {
  const {
    setSelectedProduct: setSelectedProductForEdit,
    modalState: modalStateForEdit,
    formState: formStateForEdit,
    register: registerForEdit,
    onSubmit: onSubmitForEdit
  } = useEditProductModal()
  const {
    handleDelete,
    modalState: modalStateForDelete,
    setSelectedProduct: setSelectedProductForDelete
  } = useDeleteProductModal()
  const {
    setSelectedProduct: setSelectedProductForAddMore,
    selectedProduct: selectedProductForAddMore,
    modalState: modalStateForAddMore,
    formState: formStateForAddMore,
    register: registerForAddMore,
    onSubmit: onSubmitForAddMore
  } = useAddMoreProductModal()
  const {
    register: registerForHouseAccount,
    formState: formStateForHouseAccount,
    modalState: modalStateForHouseAccount,
    onSubmit: onSubmitForHouseAccount,
    selectedProduct: selectedProductForHouseAccount,
    setSelectedProduct: setSelectedProductForHouseAccount
  } = useHouseAccountModal()
  const { products, setSearch, page, setPage } = useFilterProduct()

  return (
    <Card className="gap-0 overflow-hidden bg-card/80">
      <CardHeader className="flex flex-col gap-4 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Inventario</CardTitle>
          <CardDescription>Consulta y gestiona tus productos.</CardDescription>
        </div>
        <div className="relative w-full sm:w-64">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            className="pl-9"
            placeholder="Buscar producto"
            aria-label="Buscar producto"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="border-y border-border/60">
          <TableUI>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-0 hover:bg-transparent">
                <TableHead className="h-9 px-5 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  Producto
                </TableHead>
                <TableHead className="h-9 px-5 text-center text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  Cantidad
                </TableHead>
                <TableHead className="h-9 px-5 text-center text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  Precio de venta
                </TableHead>
                <TableHead className="hidden h-9 px-5 text-center text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground lg:table-cell">
                  Costo de importación
                </TableHead>
                <TableHead className="h-9 px-5 text-right text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.result.map((product) => (
                <TableRow key={product.id} className="group border-border/50 hover:bg-muted/30">
                  <TableCell className="px-5 py-3 font-medium">{product.name}</TableCell>
                  <TableCell className="px-5 py-3 text-center tabular-nums">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        aria-hidden="true"
                        className={cn(
                          'size-1.5 rounded-full',
                          product.quantity <= 0
                            ? 'bg-destructive'
                            : product.quantity <= 10
                              ? 'bg-warning'
                              : 'bg-brand/70'
                        )}
                      />
                      {formatNumber(product.quantity)}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-3 text-center tabular-nums">
                    {formatMoney(product.price)}
                  </TableCell>
                  <TableCell className="hidden px-5 py-3 text-center tabular-nums text-muted-foreground lg:table-cell">
                    {formatMoney(product.importCost)}
                  </TableCell>
                  <TableCell className="px-5 py-3">
                    <div className="flex items-center justify-end gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:text-foreground"
                        title="Editar"
                        aria-label={`Editar ${product.name}`}
                        onClick={() => setSelectedProductForEdit(product)}
                      >
                        <Pencil className="size-3.5" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:text-foreground"
                        title="Importar más"
                        aria-label={`Importar más de ${product.name}`}
                        onClick={() => setSelectedProductForAddMore(product)}
                      >
                        <PackagePlus className="size-3.5" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:text-foreground"
                        title="Cuenta de la casa"
                        aria-label={`Descontar ${product.name} a cuenta de la casa`}
                        onClick={() => setSelectedProductForHouseAccount(product)}
                      >
                        <House className="size-3.5" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        title="Eliminar"
                        aria-label={`Eliminar ${product.name}`}
                        onClick={() => setSelectedProductForDelete(product)}
                      >
                        <Trash2 className="size-3.5" aria-hidden="true" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {products.result.length === 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5} className="px-5 py-16">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <span className="grid size-11 place-items-center rounded-full bg-muted text-muted-foreground">
                        <PackageSearch className="size-4" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-sm font-medium">No hay productos</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Añade tu primer producto para comenzar.
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </TableUI>
        </div>

        {products.totalPages > 1 && (
          <div className="px-5 py-3">
            <Pagination
              page={page}
              paginationSize={5}
              totalItems={products.totalItems}
              totalPages={products.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}

        {/* Modal de editar producto */}
        <Dialog
          open={modalStateForEdit}
          onOpenChange={(e) => {
            if (!e) setSelectedProductForEdit(null)
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar producto</DialogTitle>
              <DialogDescription>
                Puedes editar el nombre y el precio de venta del producto.
              </DialogDescription>
            </DialogHeader>
            <form className="flex flex-col gap-5" onSubmit={onSubmitForEdit}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-product-name">Nombre</Label>
                <Input id="edit-product-name" {...registerForEdit('name')} required />
                <FormError formState={formStateForEdit} name="name" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-product-price">Precio de venta</Label>
                <Input
                  id="edit-product-price"
                  {...registerForEdit('price')}
                  type="number"
                  required
                  min="0"
                  step="0.01"
                />
                <FormError formState={formStateForEdit} name="price" />
              </div>
              <DialogFooter>
                <DialogClose
                  render={<Button type="button" variant="outline" />}
                  onClick={() => setSelectedProductForEdit(null)}
                >
                  Cancelar
                </DialogClose>
                <Button type="submit">Guardar cambios</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modal de eliminar producto */}
        <Dialog
          open={modalStateForDelete}
          onOpenChange={(e) => {
            if (!e) setSelectedProductForDelete(null)
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Eliminar producto</DialogTitle>
              <DialogDescription>
                Se eliminarán todos los datos relacionados con este producto. Esta acción
                repercutirá en tus estadísticas de venta.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>Cancelar</DialogClose>
              <Button variant="destructive" onClick={handleDelete}>
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal para importar más productos de un tipo */}
        <Dialog
          open={modalStateForAddMore}
          onOpenChange={(e) => {
            if (!e) setSelectedProductForAddMore(null)
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Importar más productos</DialogTitle>
              <DialogDescription>Completa los datos para añadirlo al inventario.</DialogDescription>
            </DialogHeader>
            <form className="flex flex-col gap-5" onSubmit={onSubmitForAddMore}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="import-product-name">Nombre</Label>
                <Input
                  value={selectedProductForAddMore ? selectedProductForAddMore.name : ''}
                  id="import-product-name"
                  required
                  disabled
                  placeholder="Nombre del producto"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="import-cost">Costo de importación por unidad</Label>
                <Input
                  {...registerForAddMore('importCost')}
                  id="import-cost"
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
                <FormError formState={formStateForAddMore} name="importCost" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="quantity">Cantidad</Label>
                  <Input
                    {...registerForAddMore('quantity')}
                    id="quantity"
                    required
                    type="number"
                    min="0"
                    placeholder="0"
                  />
                  <FormError formState={formStateForAddMore} name="quantity" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="price">Precio de venta</Label>
                  <Input
                    {...registerForAddMore('price')}
                    id="price"
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                  <FormError formState={formStateForAddMore} name="price" />
                </div>
              </div>
              <DialogFooter>
                <DialogClose render={<Button type="button" variant="outline" />}>
                  Cancelar
                </DialogClose>
                <Button
                  type="submit"
                  disabled={formStateForAddMore.isSubmitting || !formStateForAddMore.isValid}
                >
                  Guardar producto
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modal para liberar productos como cuenta de la casa */}
        <Dialog
          open={modalStateForHouseAccount}
          onOpenChange={(e) => {
            if (!e) setSelectedProductForHouseAccount(null)
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Descontar a cuenta de la casa</DialogTitle>
              <DialogDescription>
                Registra los productos usados para beneficio personal o de la casa.
              </DialogDescription>
            </DialogHeader>
            <form className="flex flex-col gap-5" onSubmit={onSubmitForHouseAccount}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="house-product-name">Producto</Label>
                <Input
                  value={selectedProductForHouseAccount ? selectedProductForHouseAccount.name : ''}
                  required
                  placeholder="Nombre del producto"
                  id="house-product-name"
                  disabled
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="house-product-quantity">Cantidad</Label>
                <Input
                  {...registerForHouseAccount('quantity')}
                  max={
                    selectedProductForHouseAccount
                      ? selectedProductForHouseAccount.quantity
                      : Number.POSITIVE_INFINITY
                  }
                  type="number"
                  min="0"
                  id="house-product-quantity"
                />
                <FormError formState={formStateForHouseAccount} name="quantity" />
              </div>
              <DialogFooter>
                <DialogClose render={<Button type="button" variant="outline" />}>
                  Cancelar
                </DialogClose>
                <Button type="submit">Descontar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
