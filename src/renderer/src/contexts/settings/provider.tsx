import { createContext, JSX, PropsWithChildren, useContext } from 'react'
import useSettingsHook, { SettingsHookReturn } from './hook'

const SettingsContext = createContext<SettingsHookReturn>({
  change: () => {},
  isLocked: false,
  lockPin: null,
  revenue: 0,
  saved: true,
  theme: 'dark',
  onSubmit: () => {}
})

// eslint-disable-next-line
export const useSettings = (): SettingsHookReturn => useContext(SettingsContext)

export default function SettingsProvider(props: PropsWithChildren): JSX.Element {
  return (
    <SettingsContext.Provider value={useSettingsHook()}>{props.children}</SettingsContext.Provider>
  )
}
