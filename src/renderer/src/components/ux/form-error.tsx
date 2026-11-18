import type { FieldValues, FormState } from 'react-hook-form'
import { JSX } from 'react/jsx-runtime'

export default function FormError<T>({ name, formState }: FormErrorProps<T>): null | JSX.Element {
  if (!formState.errors[name]) return null

  const message = formState.errors[name].message as string

  return <div className="text-red-500 text-xs p-0 m-0">{message}</div>
}

type FormErrorProps<T> = {
  name: keyof T
  formState: FormState<T extends FieldValues ? T : any>
}
