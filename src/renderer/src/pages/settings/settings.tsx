import { JSX, useEffect, useRef, useState } from 'react'
import { Check, LockKeyhole, Palette, Percent, Settings2 } from 'lucide-react'
import { Badge } from '@renderer/components/ui/badge'
import { Button } from '@renderer/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@renderer/components/ui/card'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import { Separator } from '@renderer/components/ui/separator'
import { Switch } from '@renderer/components/ui/switch'
import ThemeSelector from '@renderer/contexts/settings/components/theme-selector'
import { useSettings } from '@renderer/contexts/settings/provider'
import Layout from '@renderer/components/common/layout'

const themeLabels: Record<string, string> = {
  light: 'Claro',
  dark: 'Oscuro',
  device: 'Sistema'
}

export default function Settings(): JSX.Element {
  const { theme, revenue, change, saved, onSubmit, isLocked } = useSettings()
  const [showInputPin, setShowInputPin] = useState(isLocked)
  const revenueRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    document.title = 'BizInvento - Ajustes'
  }, [])

  useEffect(() => {
    if (revenueRef.current) revenueRef.current.value = revenue.toString()
  }, [revenue])

  return (
    <Layout
      title="Ajustes"
      description="Personaliza el comportamiento de tu sistema."
      icon={Settings2}
    >
      <form onSubmit={onSubmit} className="flex w-full max-w-3xl flex-col gap-5">
        <Card className="bg-card/80">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                  <Palette className="size-4" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div className="flex flex-col gap-1">
                  <CardTitle>Apariencia</CardTitle>
                  <CardDescription>Selecciona cómo quieres ver la aplicación.</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="font-normal text-muted-foreground">
                {themeLabels[theme] ?? theme}
              </Badge>
            </div>
          </CardHeader>
          <ThemeSelector />
        </Card>

        <Card className="bg-card/80">
          <CardHeader>
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                <Percent className="size-4" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <div className="flex flex-col gap-1">
                <CardTitle>Ganancia</CardTitle>
                <CardDescription>
                  Define el porcentaje aplicado como margen sugerido de venta.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex max-w-xs flex-col gap-2">
              <Label htmlFor="profit">Porcentaje de ganancia</Label>
              <div className="relative">
                <Input
                  ref={revenueRef}
                  id="profit"
                  type="number"
                  required
                  min="0"
                  max="1000"
                  step="0.01"
                  className="pr-10 tabular-nums"
                  onChange={(e) => change('revenue', e.target.value)}
                  aria-describedby="profit-help"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </div>
              <p id="profit-help" className="text-xs leading-relaxed text-muted-foreground">
                Se utilizará para calcular precios sugeridos desde el costo de importación.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80">
          <CardHeader>
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                <LockKeyhole className="size-4" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <div className="flex flex-col gap-1">
                <CardTitle>Seguridad</CardTitle>
                <CardDescription>Protege el acceso a la aplicación con un PIN.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4 rounded-xl border border-border/70 px-4 py-3">
              <div className="flex flex-col gap-0.5">
                <Label htmlFor="app-lock">Bloqueo de la aplicación</Label>
                <p className="text-xs text-muted-foreground">
                  Solicitar PIN al abrir o volver a la aplicación.
                </p>
              </div>
              <Switch
                id="app-lock"
                checked={showInputPin}
                onCheckedChange={(e) => {
                  setShowInputPin(e)
                  change('lockPin', null)
                }}
              />
            </div>
            {showInputPin && (
              <div className="flex animate-in flex-col gap-3 fade-in duration-200">
                <Separator />
                <div className="flex max-w-xs flex-col gap-2">
                  <Label htmlFor="pin">PIN de seguridad</Label>
                  <Input
                    id="pin"
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    pattern="[0-9]{6}"
                    placeholder="••••••"
                    className="tracking-[0.3em]"
                    aria-describedby="pin-help"
                    onChange={(e) => change('lockPin', e.target.value)}
                    required
                  />
                  <p id="pin-help" className="text-xs text-muted-foreground">
                    Debe contener exactamente 6 dígitos.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-end pb-6">
          {saved ? (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Check className="size-3.5 text-brand" aria-hidden="true" />
              Cambios guardados
            </p>
          ) : (
            <Button type="submit" size="lg">
              Guardar cambios
            </Button>
          )}
        </div>
      </form>
    </Layout>
  )
}
