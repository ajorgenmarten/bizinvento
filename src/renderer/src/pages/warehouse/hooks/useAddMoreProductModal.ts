import { useEffect } from 'react'
import useModal, { UseModalReturnType } from './useModal'
import { useFilterProduct } from '../contexts/filter-products'
import z from 'zod'
import { FormState, useForm, UseFormRegister } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { useSettings } from '@renderer/contexts/settings/provider'

const addMoreProductSchema = z.object({
  id: z.string(),
  quantity: z.coerce
    .number()
    .int('La cantidad debe ser un número entero')
    .positive('La cantidad debe ser mayor a 0')
    .min(1, 'La cantidad mínima es 1')
    .max(999999, 'La cantidad máxima es 999999'),
  price: z.coerce
    .number()
    .positive('El precio debe ser mayor a 0')
    .min(0.01, 'El precio mínimo es 0.01')
    .max(999999.99, 'El precio máximo es 999999.99')
    .refine((val) => Number(val.toFixed(2)) === val, 'El precio solo puede tener 2 decimales'),

  importCost: z.coerce
    .number()
    .min(0, 'El costo de importación no puede ser negativo')
    .max(999999.99, 'El costo máximo es 999999.99')
    .refine((val) => Number(val.toFixed(2)) === val, 'El costo solo puede tener 2 decimales')
})

export type UseAddMoreProductModalReturnType = UseModalReturnType & {
  register: UseFormRegister<{
    id: string
    quantity: unknown
    price: unknown
    importCost: unknown
  }>
  formState: FormState<{
    id: string
    quantity: unknown
    price: unknown
    importCost: unknown
  }>
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<string | number | void | undefined>
}

export default function useAddMoreProductModal(): UseAddMoreProductModalReturnType {
  const { revenue } = useSettings()
  const { selectedProduct, setSelectedProduct, modalState } = useModal()
  const { refresh } = useFilterProduct()
  const { register, formState, handleSubmit, setValues, setValue, reset, watch } = useForm({
    resolver: zodResolver(addMoreProductSchema),
    mode: 'all'
  })
  const watchedImportCost = watch('importCost')

  useEffect(() => {
    if (!selectedProduct) return

    setValues({
      id: selectedProduct.id,
      importCost: selectedProduct.importCost,
      price: selectedProduct.price,
      quantity: 0
    })
  }, [selectedProduct])

  useEffect(() => {
    if (!watchedImportCost) return
    setValue('price', Number(watchedImportCost) * (revenue / 100) + Number(watchedImportCost))
  }, [watchedImportCost])

  const onSubmit = handleSubmit((schema) =>
    window.electron.ipcRenderer
      .invoke('warehouse:add-more', schema)
      .then(() => toast.success('Producto importado!'))
      .then(() => {
        reset()
        refresh()
      })
      .catch((e) => toast.error(e.message ?? 'Ha ocurrido un error'))
  )

  return { selectedProduct, setSelectedProduct, modalState, register, formState, onSubmit }
}
