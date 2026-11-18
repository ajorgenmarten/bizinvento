import { createContext, JSX, PropsWithChildren, useContext } from 'react'
import useSecureHook from './hook'

type ContextType = ReturnType<typeof useSecureHook>

const SecureContext = createContext<ContextType>({
  qrPayload: '',
  status: 'active',
  activeLicense: () => Promise.resolve(false)
})

const useSecure = (): ContextType => useContext(SecureContext)

function SecureProvider(props: PropsWithChildren): JSX.Element {
  return <SecureContext.Provider value={useSecureHook()}>{props.children}</SecureContext.Provider>
}

export { useSecure, SecureProvider, SecureContext }
