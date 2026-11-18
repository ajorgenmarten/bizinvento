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
import { Separator } from '@renderer/components/ui/separator'
import { House, Import, Pen, Search, Trash } from 'lucide-react'
import { JSX } from 'react/jsx-runtime'
import { useFilterProduct } from '../contexts/filter-products'
import SuperPagination from '@renderer/components/ux/pagination'
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
    <Card>
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Lista de productos</CardTitle>
          <CardDescription>Consulta y revisa tu inventario actual.</CardDescription>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Buscar producto"
            aria-label="Buscar producto"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        <TableUI>
          <TableHeader>
            <TableRow>
              <TableHead className="text-start">Producto</TableHead>
              <TableHead className="text-center">Cantidad</TableHead>
              <TableHead className="text-center">Precio de venta</TableHead>
              <TableHead className="text-center">Costo de importe</TableHead>
              <TableHead className="text-center">Opciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.result.map((product, index) => (
              <TableRow key={product.id} className={index % 2 === 0 ? 'bg-muted' : ''}>
                <TableCell className="text-start">{product.name}</TableCell>
                <TableCell className="text-center">{product.quantity}</TableCell>
                <TableCell className="text-center">{product.price}</TableCell>
                <TableCell className="text-center">{product.importCost}</TableCell>
                <TableCell className="justify-end flex gap-2">
                  <Button
                    onClick={() => setSelectedProductForEdit(product)}
                    title="Editar"
                    className="bg-yellow-600 hover:bg-yellow-700/70 dark:bg-yellow-200 dark:hover:bg-yellow-300/80 transition-colors"
                  >
                    <Pen />
                  </Button>
                  <Button
                    title="Borrar"
                    onClick={() => setSelectedProductForDelete(product)}
                    className="bg-red-400 hover:bg-red-600/70 dark:bg-red-300 dark:hover:bg-red-400/80 transition-colors"
                  >
                    <Trash />
                  </Button>
                  <Button
                    title="Importar más"
                    onClick={() => setSelectedProductForAddMore(product)}
                  >
                    <Import />
                  </Button>
                  <Button
                    type="button"
                    title="Cuenta casa"
                    onClick={() => setSelectedProductForHouseAccount(product)}
                  >
                    <House />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableUI>
        {/*Modal de editar producto*/}
        <Dialog
          open={modalStateForEdit}
          onOpenChange={(e) => {
            if (!e) setSelectedProductForEdit(null)
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Producto</DialogTitle>
              <DialogDescription>
                Puedes editar nombre y precio de venta del producto
              </DialogDescription>
            </DialogHeader>
            <form className="flex flex-col gap-5" onSubmit={onSubmitForEdit}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="product-name">Nombre</Label>
                <Input id="product-name" {...registerForEdit('name')} required />
                <FormError formState={formStateForEdit} name="name" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="product-price">Precio de venta</Label>
                <Input
                  id="product-price"
                  {...registerForEdit('price')}
                  type="number"
                  required
                  min="0"
                  step="0.01"
                />
                <FormError formState={formStateForEdit} name="price" />
              </div>
              <DialogFooter>
                <DialogClose type="button" onClick={() => setSelectedProductForEdit(null)}>
                  Cancelar
                </DialogClose>
                <Button type="submit">Editar producto</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {/*Modal de eliminar producto*/}
        <Dialog
          open={modalStateForDelete}
          onOpenChange={(e) => {
            if (!e) setSelectedProductForDelete(null)
          }}
        >
          <DialogContent>
            <DialogTitle>Eliminar producto</DialogTitle>
            <DialogDescription>
              Si elimina el producto se eliminarán todos los datos relacionados con este. Tén en
              cuanta que esto repercute en tus estádisticas de venta
            </DialogDescription>
            <DialogFooter>
              <DialogClose>Cancelar</DialogClose>
              <Button variant="destructive" onClick={handleDelete}>
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/*Modal para importar más productos de un tipo*/}
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
                <Label htmlFor="product-name">Nombre</Label>
                <Input
                  value={selectedProductForAddMore ? selectedProductForAddMore.name : ''}
                  id="product-name"
                  required
                  disabled
                  placeholder="Nombre del producto"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="import-cost">Costo de importe por unidad</Label>
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
                <DialogClose type="button">Cancelar</DialogClose>
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
        {/*Modal para liberar productos como cuenta casa*/}
        <Dialog
          open={modalStateForHouseAccount}
          onOpenChange={(e) => {
            if (!e) setSelectedProductForHouseAccount(null)
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Descuenta productos a nombre de la casa</DialogTitle>
              <DialogDescription>
                Registra los productos usados para beneficio personal o de la casa
              </DialogDescription>
            </DialogHeader>
            <form className="flex flex-col gap-5" onSubmit={onSubmitForHouseAccount}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="product-name">Producto</Label>
                <Input
                  value={selectedProductForHouseAccount ? selectedProductForHouseAccount.name : ''}
                  required
                  placeholder="Nombre del producto"
                  id="product-quantity"
                  disabled
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="product-quantity">Cantidad</Label>
                <Input
                  {...registerForHouseAccount('quantity')}
                  max={
                    selectedProductForHouseAccount
                      ? selectedProductForHouseAccount.quantity
                      : Number.POSITIVE_INFINITY
                  }
                  type="number"
                  min="0"
                  id="product-quantity"
                />
                <FormError formState={formStateForHouseAccount} name="quantity" />
              </div>
              <DialogFooter>
                <DialogClose type="button">Cancelar</DialogClose>
                <Button type="submit">Descontar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <SuperPagination
          page={page}
          paginationSize={5}
          totalItems={products.totalItems}
          totalPages={products.totalPages}
          onPageChange={setPage}
        />
      </CardContent>
    </Card>
  )
}
