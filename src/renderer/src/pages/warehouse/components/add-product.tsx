import { Button } from '@renderer/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@renderer/components/ui/dialog'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import { PackagePlus } from 'lucide-react'
import { JSX } from 'react/jsx-runtime'
import { useAddProduct } from '../hooks/useAddProduct'
import FormError from '@renderer/components/ux/form-error'

export default function AddProduct(): JSX.Element {
  const { register, isSubmitting, form, onSubmit } = useAddProduct()

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button>
            <PackagePlus data-icon="inline-start" />
            Agregar producto
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo producto</DialogTitle>
          <DialogDescription>Completa los datos para añadirlo al inventario.</DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="product-name">Nombre</Label>
            <Input
              {...register('name')}
              id="product-name"
              required
              placeholder="Nombre del producto"
            />
            <FormError formState={form.formState} name="name" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="import-cost">Costo de importe por unidad</Label>
            <Input
              {...register('importCost')}
              id="import-cost"
              required
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
            />
            <FormError formState={form.formState} name="importCost" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="quantity">Cantidad</Label>
              <Input
                {...register('quantity')}
                id="quantity"
                required
                type="number"
                min="0"
                placeholder="0"
              />
              <FormError formState={form.formState} name="quantity" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="price">Precio de venta</Label>
              <Input
                {...register('price')}
                id="price"
                required
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
              <FormError formState={form.formState} name="price" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose type="button">Cancelar</DialogClose>
            <Button type="submit" disabled={isSubmitting || !form.formState.isValid}>
              Guardar producto
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
