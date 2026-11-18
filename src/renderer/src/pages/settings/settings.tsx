import { JSX, useEffect, useRef, useState } from 'react'
import { ArrowLeft, Check, LockKeyhole, Palette, Percent, Settings2 } from 'lucide-react'
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
import { Link } from 'react-router'
import ThemeSelector from '@renderer/contexts/settings/components/theme-selector'
import { useSettings } from '@renderer/contexts/settings/provider'

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
    <main className="min-h-screen px-6 py-8 md:px-10 dark:bg-black">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="flex items-start gap-4">
          <Button
            nativeButton={false}
            render={
              <Link to="/">
                <ArrowLeft data-icon="inline-start" className="dark:text-white/90" />
              </Link>
            }
            variant="ghost"
            size="icon"
            aria-label="Volver al panel principal"
          ></Button>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Settings2 data-icon="inline-start" />
              <span className="text-xs font-medium uppercase tracking-[0.18em]">Configuración</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-balance">
              Ajustes de la aplicación
            </h1>
            <p className="text-sm text-muted-foreground">
              Personaliza el comportamiento de tu sistema.
            </p>
          </div>
        </header>

        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Palette data-icon="inline-start" />
                    Apariencia
                  </CardTitle>
                  <CardDescription>Selecciona cómo quieres ver la aplicación.</CardDescription>
                </div>
                <Badge variant="outline">Tema {theme}</Badge>
              </div>
            </CardHeader>
            <ThemeSelector />
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent data-icon="inline-start" />
                Ganancia
              </CardTitle>
              <CardDescription>
                Define el porcentaje aplicado como margen sugerido de venta.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex max-w-sm flex-col gap-2">
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
                    className="pr-10"
                    onChange={(e) => change('revenue', e.target.value)}
                    aria-describedby="profit-help"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    %
                  </span>
                </div>
                <p id="profit-help" className="text-xs text-muted-foreground">
                  Se utilizará para calcular precios sugeridos desde el costo de importación.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LockKeyhole data-icon="inline-start" />
                Seguridad
              </CardTitle>
              <CardDescription>Protege el acceso a la aplicación con un PIN.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
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
                <>
                  <Separator />
                  <div className="flex max-w-sm flex-col gap-2">
                    <Label htmlFor="pin">PIN de seguridad</Label>
                    <Input
                      id="pin"
                      type="password"
                      inputMode="numeric"
                      maxLength={6}
                      pattern="[0-9]{6}"
                      placeholder="••••••"
                      aria-describedby="pin-help"
                      onChange={(e) => change('lockPin', e.target.value)}
                      required
                    />
                    <p id="pin-help" className="text-xs text-muted-foreground">
                      Debe contener exactamente 6 dígitos.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
            {!saved && (
              <Button type="submit" size="lg">
                Guardar cambios
              </Button>
            )}
            {saved && (
              <p className="flex items-center justify-center gap-2 text-sm text-primary">
                <Check data-icon="inline-start" />
                Cambios guardados
              </p>
            )}
          </div>
        </form>
      </div>
    </main>
  )
}
