import z from 'zod'
import { useFilterProduct } from '../contexts/filter-products'
import useModal, { UseModalReturnType } from './useModal'
import { FormState, useForm, UseFormRegister } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { useEffect } from 'react'

const houseAccountSchema = z.object({
  id: z.uuid(),
  quantity: z.coerce.number().min(1)
})

export type HouseAccountFormData = z.infer<typeof houseAccountSchema>

export type UseHouseAccountModalReturnType = UseModalReturnType & {
  register: UseFormRegister<{
    id: string
    quantity: unknown
  }>
  formState: FormState<{
    id: string
    quantity: unknown
  }>
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void | undefined>
}

export default function useHouseAccountModal(): UseHouseAccountModalReturnType {
  const { refresh } = useFilterProduct()
  const { modalState, selectedProduct, setSelectedProduct } = useModal()
  const { register, formState, handleSubmit, setValues, reset } = useForm({
    resolver: zodResolver(houseAccountSchema),
    mode: 'all'
  })

  useEffect(() => {
    if (!selectedProduct) return
    setValues({ id: selectedProduct.id, quantity: 0 })
  }, [selectedProduct])

  const onSubmit = handleSubmit((data) =>
    window.electron.ipcRenderer
      .invoke('warehouse:house-account', data)
      .then(() => {
        toast.success(`Operación satisfactoria`)
        refresh()
        reset()
      })
      .catch(() => {
        console.log('Ha ocurrido un problema!')
      })
  )

  return { modalState, selectedProduct, setSelectedProduct, register, formState, onSubmit }
}
