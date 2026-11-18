import { Product } from '@renderer/commons/types'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'

export type UseModalReturnType = {
  selectedProduct: Product | null
  setSelectedProduct: Dispatch<SetStateAction<Product | null>>
  modalState: boolean
}

export default function useModal() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const modalState = useMemo(() => (selectedProduct != null ? true : false), [selectedProduct])
  return { selectedProduct, setSelectedProduct, modalState }
}
