import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useFilterProduct } from '../contexts/filter-products'
import { useSettings } from '@renderer/contexts/settings/provider'

const productSchema = z.object({
  name: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder los 100 caracteres')
    .regex(
      /^[a-zA-ZÁÉÍÓÚáéíóú0-9\s\-_.]+$/,
      'Solo se permiten letras, números, espacios, guiones y guiones bajos'
    ),

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

export type ProductFormData = z.infer<typeof productSchema>

const defaultValues: ProductFormData = {
  name: '',
  quantity: 0,
  price: 0,
  importCost: 0
}

// eslint-disable-next-line
export const useAddProduct = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const { revenue } = useSettings()
  const { refresh } = useFilterProduct()


  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues,
    mode: 'all'
  })

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = form

  const watchedImportCost = watch('importCost')

  useEffect(() => {
    setValue('price', watchedImportCost * (revenue / 100) + Number(watchedImportCost))
  }, [watchedImportCost])

  // Función para enviar datos a IPC Main
  const sendToIpcMain = async (data: ProductFormData): Promise<void> => {
    // Verificar que window.electron existe
    if (!window.electron?.ipcRenderer) {
      toast.error('IPC Renderer no disponible')
      return
    }

    // Enviar evento a IPC Main
    return await window.electron.ipcRenderer.invoke('warehouse:add-product', data)
  }

  // Función de submit
  // eslint-disable-next-line
  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      // Preparar datos (asegurar números con 2 decimales)
      const processedData = {
        ...data,
        price: Number(data.price.toFixed(2)),
        importCost: Number(data.importCost.toFixed(2)),
        quantity: Number(data.quantity)
      }

      // Enviar a IPC Main
      const result = await sendToIpcMain(processedData)

      setSubmitSuccess(true)
      await refresh()
      reset() // Resetear formulario después de éxito

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setSubmitError(errorMessage)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  // Función para resetear el formulario y estados
  const resetForm = (): void => {
    reset()
    setSubmitError(null)
    setSubmitSuccess(false)
  }

  return {
    // Propiedades del formulario
    form,
    register: form.register,
    control: form.control,
    errors,
    isSubmitting,
    submitError,
    submitSuccess,

    // Métodos
    onSubmit: handleSubmit(onSubmit),
    resetForm,
    setValue: form.setValue,
    getValues: form.getValues,
    watch: form.watch,
    trigger: form.trigger
  }
}

// Exportar el schema por si se necesita en otro lado
export { productSchema }
