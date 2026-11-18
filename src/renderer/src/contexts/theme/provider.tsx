import { createContext, PropsWithChildren, useContext } from 'react'
import { JSX } from 'react/jsx-runtime'

const ThemeContext = createContext(null)

// eslint-disable-next-line
export const useTheme = () => useContext(ThemeContext)

export default function ThemeProvider(props: PropsWithChildren): JSX.Element {
  return <ThemeContext.Provider value={null}>{props.children}</ThemeContext.Provider>
}
