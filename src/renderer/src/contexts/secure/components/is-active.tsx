import { JSX } from 'react/jsx-runtime'
import { useSecure } from '../provider'
import { PropsWithChildren } from 'react'
import { Navigate } from 'react-router'

export default function IsActive(props: PropsWithChildren): JSX.Element | React.ReactNode {
  const { status } = useSecure()

  if (status === 'active') return props.children

  return <Navigate to="/activation" />
}
