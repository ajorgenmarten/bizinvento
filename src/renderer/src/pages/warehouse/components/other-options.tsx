import { Button } from '@renderer/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@renderer/components/ui/dropdown-menu'
import { JSX } from 'react/jsx-runtime'
import HouseAccount from './house-account'
import { Product } from '@renderer/commons/types'
import AddMoreProduct from './add-more-product'

type OtherOptionsProps = {
  product: Product
}

export default function OtherOptions(props: OtherOptionsProps): JSX.Element {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button>Opciones</Button>} />
      <DropdownMenuContent className="w-40">
        <DropdownMenuItem className="flex items-center justify-between">
          <HouseAccount product={props.product} /> Cuenta casa
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center justify-between">
          <AddMoreProduct product={props.product} /> Importar más
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
