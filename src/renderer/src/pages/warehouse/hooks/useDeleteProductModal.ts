import { Product } from '@renderer/commons/types'
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { useFilterProduct } from '../contexts/filter-products'
import { toast } from 'react-toastify'

export type UseDeleteProductModalReturnType = {
  modalState: boolean
  setSelectedProduct: Dispatch<SetStateAction<Product | null>>
  handleDelete: () => Promise<string | number | void>
}

export default function useDeleteProductModal(): UseDeleteProductModalReturnType {
  const { refresh } = useFilterProduct()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const modalState = useMemo(() => (selectedProduct != null ? true : false), [selectedProduct])

  const handleDelete = useCallback(
    (): Promise<string | number | void> =>
      window.electron.ipcRenderer
        .invoke('warehouse:delete-product', { id: selectedProduct?.id })
        .then(() => refresh().then(() => setSelectedProduct(null)))
        .catch((e) => toast.error(e.message)),
    [selectedProduct]
  )

  return { modalState, setSelectedProduct, handleDelete }
}
