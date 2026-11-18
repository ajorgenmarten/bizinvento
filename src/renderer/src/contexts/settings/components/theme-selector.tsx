import { Button } from '@renderer/components/ui/button'
import { CardContent } from '@renderer/components/ui/card'
import { useSettings } from '../provider'
import { JSX, useMemo } from 'react'
import { Check } from 'lucide-react'

const themes = [
  { label: 'Oscuro', value: 'dark' },
  { label: 'Claro', value: 'light' },
  { label: 'Dispositivo', value: 'device' }
]

export default function ThemeSelector(): JSX.Element {
  return (
    <CardContent className="grid gap-3 sm:grid-cols-3">
      {themes.map((values, index) => (
        <ThemeButton key={`${values.value}-${index}`} {...values} />
      ))}
    </CardContent>
  )
}

type ThemeButtonProps = {
  label: string
  value: string
}

function ThemeButton({ label, value }: ThemeButtonProps): JSX.Element {
  const { theme, change } = useSettings()
  const isActive = useMemo(() => value === theme, [theme, value])
  return (
    <Button
      type="button"
      variant={isActive ? 'default' : 'outline'}
      className="h-auto justify-start py-4 capitalize"
      onClick={() => change('theme', value)}
    >
      {isActive && <Check data-icon="inline-start" />}
      {label}
    </Button>
  )
}
