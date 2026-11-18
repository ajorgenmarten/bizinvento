import { SubmitEventHandler, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'device'
type ChangeOptions = 'theme' | 'revenue' | 'lockPin'
export type SettingsHookReturn = {
  change: (option: ChangeOptions, value: Theme | string | number) => void
  theme: Theme
  saved: boolean
  revenue: number
  isLocked: boolean
  lockPin: string | null
  onSubmit: SubmitEventHandler
}

export default function useSettingsHook(): SettingsHookReturn {
  const [saved, setSaved] = useState(true)
  const [theme, setTheme] = useState<Theme>('dark')
  const [revenue, setRevenue] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockPin, setLockPin] = useState<string | null>(null)

  useEffect(() => {
    window.electron.ipcRenderer.invoke('settings:get-settings').then((response) => {
      setTheme(response.theme as Theme)
      setRevenue(response.revenue)
      setIsLocked(response.isLocked)
    })
  }, [])

  useEffect(() => {
    const mediaQuery = matchMedia('(prefers-colors-scheme: dark)')
    const html = document.querySelector('html') as HTMLElement
    const htmlTheme = theme == 'device' ? (mediaQuery.matches ? 'dark' : 'light') : theme
    html.className = htmlTheme
  }, [theme])

  function change(option: ChangeOptions, value: Theme | string | number | null): void {
    setSaved(false)
    if (option == 'theme') setTheme(value as Theme)
    if (option == 'revenue') setRevenue(value as number)
    if (option == 'lockPin') {
      setLockPin(value ? String(value) : null)
      setIsLocked(true)
    }
  }

  const onSubmit: SubmitEventHandler = (e) => {
    e.preventDefault()
    const dataToSave = {
      lockPin: lockPin && lockPin !== null ? String(lockPin) : null,
      revenue: Number(revenue),
      theme: String(theme)
    }
    window.electron.ipcRenderer.invoke('settings:set-settings', dataToSave).then(() => {
      setSaved(true)
      setIsLocked(dataToSave.lockPin ? true : false)
      setLockPin(null)
    })
  }

  return { change, theme, saved, revenue, isLocked, lockPin, onSubmit }
}
