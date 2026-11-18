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
import FormError from '@renderer/components/ux/form-error'
import { Import } from 'lucide-react'
import { JSX } from 'react/jsx-runtime'
import useAddMoreProduct from '../hooks/useAddMoreProduct'
import { Product } from '@renderer/commons/types'

type AddMoreProductProps = {
  product: Product
}

export default function AddMoreProduct(props: AddMoreProductProps): JSX.Element {
  const { formState, register, onSubmit } = useAddMoreProduct(props.product)
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button title="Importar más">
            <Import />
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importar más productos</DialogTitle>
          <DialogDescription>Completa los datos para añadirlo al inventario.</DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="product-name">Nombre</Label>
            <Input
              value={props.product.name}
              id="product-name"
              required
              disabled
              placeholder="Nombre del producto"
            />
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
            <FormError formState={formState} name="importCost" />
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
              <FormError formState={formState} name="quantity" />
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
              <FormError formState={formState} name="price" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose type="button">Cancelar</DialogClose>
            <Button type="submit" disabled={formState.isSubmitting || !formState.isValid}>
              Guardar producto
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
