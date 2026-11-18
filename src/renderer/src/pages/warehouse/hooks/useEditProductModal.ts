import { Product } from '@renderer/commons/types'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import z from 'zod'
import { useFilterProduct } from '../contexts/filter-products'
import { FormState, useForm, UseFormRegister } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'

const editProductSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder los 100 caracteres')
    .regex(
      /^[a-zA-ZÁÉÍÓÚáéíóú0-9\s\-_.]+$/,
      'Solo se permiten letras, números, espacios, guiones y guiones bajos'
    ),
  price: z.coerce
    .number()
    .positive('El precio debe ser mayor a 0')
    .min(0.01, 'El precio mínimo es 0.01')
    .max(999999.99, 'El precio máximo es 999999.99')
    .refine((val) => Number(val.toFixed(2)) === val, 'El precio solo puede tener 2 decimales')
})

export type EditFormData = z.infer<typeof editProductSchema>

export type UseEditProductModalReturnType = {
  setSelectedProduct: Dispatch<SetStateAction<Product | null>>
  modalState: boolean
  register: UseFormRegister<{
    id: string
    name: string
    price: unknown
  }>
  formState: FormState<{
    id: string
    name: string
    price: unknown
  }>
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void | undefined>;
}

export default function useEditProductModal(): UseEditProductModalReturnType {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const { refresh } = useFilterProduct()

  const { register, formState, handleSubmit, setValues } = useForm({
    resolver: zodResolver(editProductSchema),
    mode: 'all'
  })

  const onSubmit = handleSubmit((data: EditFormData): Promise<void> =>
    window.electron.ipcRenderer.invoke('warehouse:edit-product', data).then(() => {
      refresh()
      toast.success('Producto editado.')
    })
  )

  useEffect(() => {
    if (!selectedProduct) return
    setValues({ id: selectedProduct.id, name: selectedProduct.name, price: selectedProduct.price })
  }, [selectedProduct])

  const modalState = useMemo(() => (selectedProduct != null ? true : false), [selectedProduct])

  return { setSelectedProduct, modalState, register, formState, onSubmit }
}
