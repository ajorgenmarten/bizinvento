import { Button } from '@renderer/components/ui/button'
import { CardContent } from '@renderer/components/ui/card'
import { useSettings } from '../provider'
import { JSX } from 'react'
import { Check, Monitor, Moon, Sun } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@renderer/lib/utils'

type ThemeOption = {
  label: string
  value: 'light' | 'dark' | 'device'
  icon: LucideIcon
}

const themes: ThemeOption[] = [
  { label: 'Claro', value: 'light', icon: Sun },
  { label: 'Oscuro', value: 'dark', icon: Moon },
  { label: 'Sistema', value: 'device', icon: Monitor }
]

export default function ThemeSelector(): JSX.Element {
  return (
    <CardContent className="grid gap-2 sm:grid-cols-3">
      {themes.map((theme) => (
        <ThemeButton key={theme.value} {...theme} />
      ))}
    </CardContent>
  )
}

function ThemeButton({ label, value, icon: Icon }: ThemeOption): JSX.Element {
  const { theme, change } = useSettings()
  const isActive = value === theme

  return (
    <Button
      type="button"
      variant="ghost"
      aria-pressed={isActive}
      onClick={() => change('theme', value)}
      className={cn(
        'group h-auto flex-col items-start gap-3 rounded-xl border p-4 text-left transition-all',
        isActive
          ? 'border-foreground/20 bg-card hover:bg-card'
          : 'border-border/70 bg-transparent hover:border-foreground/10 hover:bg-muted/40'
      )}
    >
      <span className="flex w-full items-center justify-between">
        <span
          className={cn(
            'grid size-8 place-items-center rounded-lg transition-colors',
            isActive ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
          )}
        >
          <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
        </span>
        {isActive && <Check className="size-3.5 text-brand" aria-hidden="true" />}
      </span>
      <span className="text-sm font-medium">{label}</span>
    </Button>
  )
}
