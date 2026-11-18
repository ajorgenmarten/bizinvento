
'use client'

import { useState } from 'react'
import { ArrowLeft, Check, LockKeyhole, Palette, Percent, Settings2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

export function SettingsScreen() {
  const [theme, setTheme] = useState('oscuro')
  const [profit, setProfit] = useState('30')
  const [appLock, setAppLock] = useState(false)
  const [pin, setPin] = useState('')
  const [saved, setSaved] = useState(false)

  function saveSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (appLock && !/^\d{6}$/.test(pin)) return
    setSaved(true)
  }

  return (
    <main className="min-h-screen px-6 py-8 md:px-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="flex items-start gap-4">
          <Button asChild variant="ghost" size="icon" aria-label="Volver al panel principal">
            <a href="/"><ArrowLeft data-icon="inline-start" /></a>
          </Button>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-muted-foreground"><Settings2 data-icon="inline-start" /><span className="text-xs font-medium uppercase tracking-[0.18em]">Configuración</span></div>
            <h1 className="text-3xl font-semibold tracking-tight text-balance">Ajustes de la aplicación</h1>
            <p className="text-sm text-muted-foreground">Personaliza el comportamiento de tu sistema.</p>
          </div>
        </header>

        <form onSubmit={saveSettings} className="flex flex-col gap-6">
          <Card>
            <CardHeader><div className="flex items-start justify-between gap-4"><div><CardTitle className="flex items-center gap-2"><Palette data-icon="inline-start" />Apariencia</CardTitle><CardDescription>Selecciona cómo quieres ver la aplicación.</CardDescription></div><Badge variant="outline">Tema {theme}</Badge></div></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              {['claro', 'oscuro', 'sistema'].map((option) => <Button key={option} type="button" variant={theme === option ? 'default' : 'outline'} className="h-auto justify-start py-4 capitalize" onClick={() => { setTheme(option); setSaved(false) }}>{theme === option && <Check data-icon="inline-start" />}{option}</Button>)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Percent data-icon="inline-start" />Ganancia</CardTitle><CardDescription>Define el porcentaje aplicado como margen sugerido de venta.</CardDescription></CardHeader>
            <CardContent><div className="flex max-w-sm flex-col gap-2"><Label htmlFor="profit">Porcentaje de ganancia</Label><div className="relative"><Input id="profit" type="number" min="0" max="1000" step="0.01" value={profit} onChange={(event) => { setProfit(event.target.value); setSaved(false) }} className="pr-10" aria-describedby="profit-help" /><span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span></div><p id="profit-help" className="text-xs text-muted-foreground">Se utilizará para calcular precios sugeridos desde el costo de importación.</p></div></CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><LockKeyhole data-icon="inline-start" />Seguridad</CardTitle><CardDescription>Protege el acceso a la aplicación con un PIN.</CardDescription></CardHeader>
            <CardContent className="flex flex-col gap-5"><div className="flex items-center justify-between gap-4"><div className="flex flex-col gap-1"><Label htmlFor="app-lock">Bloqueo de la aplicación</Label><p className="text-xs text-muted-foreground">Solicitar PIN al abrir o volver a la aplicación.</p></div><Switch id="app-lock" checked={appLock} onCheckedChange={(checked) => { setAppLock(checked); setSaved(false) }} /></div>{appLock && <><Separator /><div className="flex max-w-sm flex-col gap-2"><Label htmlFor="pin">PIN de seguridad</Label><Input id="pin" type="password" inputMode="numeric" maxLength={6} pattern="[0-9]{6}" value={pin} onChange={(event) => { setPin(event.target.value.replace(/\D/g, '').slice(0, 6)); setSaved(false) }} placeholder="••••••" aria-describedby="pin-help" required /><p id="pin-help" className="text-xs text-muted-foreground">Debe contener exactamente 6 dígitos.</p></div></>}</CardContent>
          </Card>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end"><Button type="submit" size="lg">Guardar cambios</Button>{saved && <p className="flex items-center justify-center gap-2 text-sm text-primary"><Check data-icon="inline-start" />Cambios guardados</p>}</div>
        </form>
      </div>
    </main>
  )
}
