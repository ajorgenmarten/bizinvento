import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@renderer/components/ui/alert-dialog'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import Brand from '@renderer/components/common/brand'
import { useSecure } from '@renderer/contexts/secure/provider'
import { Check, Clipboard, KeyRound, X } from 'lucide-react'
import { JSX, useEffect, useRef, useState } from 'react'
import QRCode from 'react-qr-code'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'

export default function Activation(): JSX.Element {
  const [key, setKey] = useState('')
  const { qrPayload, activeLicense } = useSecure()
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const navigate = useNavigate()

  async function copyPayload(): Promise<void> {
    await navigator.clipboard.writeText(qrPayload)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  async function active(): Promise<void> {
    setLoading(true)
    const result = await activeLicense(key)
    if (result) inputRef.current && (inputRef.current.value = '')
    else toast.error('La clave no es válida')
    setLoading(false)
    navigate('/')
  }

  async function exit(): Promise<void> {
    window.electron.ipcRenderer.send('secure:app-exit')
  }

  useEffect(() => {
    document.title = 'BizInvento - Activación'
  }, [])

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <Brand className="mb-8 animate-in fade-in duration-300" />

      <section
        aria-labelledby="license-title"
        className="w-full max-w-3xl animate-in overflow-hidden rounded-2xl border border-border/70 bg-card/70 shadow-2xl backdrop-blur-sm fade-in slide-in-from-bottom-2 duration-500"
      >
        <div className="grid gap-8 p-6 sm:p-10 md:grid-cols-[220px_1fr] md:items-center">
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-black/5">
              <QRCode value={qrPayload || 'BIZINVENTO'} size={168} />
            </div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground/80">
              Código de activación
            </p>
          </div>

          <div className="flex min-w-0 flex-col gap-5">
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                <KeyRound className="size-4" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <div>
                <h1 id="license-title" className="text-xl font-semibold tracking-tight">
                  Activa tu licencia
                </h1>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Escanea el código QR desde tu dispositivo autorizado o comparte su contenido para
                  completar la activación.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="qr-content">Contenido del código</Label>
              <div className="flex items-stretch gap-2">
                <textarea
                  id="qr-content"
                  readOnly
                  value={qrPayload}
                  rows={3}
                  className="min-w-0 flex-1 resize-none rounded-[10px] border border-input bg-transparent px-3 py-2 text-sm leading-6 text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-card/40"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="shrink-0 self-start"
                  onClick={copyPayload}
                  aria-label="Copiar contenido del código QR"
                >
                  {copied ? (
                    <Check className="text-brand" aria-hidden="true" />
                  ) : (
                    <Clipboard aria-hidden="true" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground" aria-live="polite">
                {copied
                  ? 'Contenido copiado.'
                  : 'Copia este texto para enviarlo a soporte o a otro dispositivo.'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse items-center gap-2 border-t border-border/60 bg-muted/30 px-6 py-4 sm:flex-row sm:justify-end sm:px-10">
          <Button variant="outline" onClick={exit} type="button">
            <X aria-hidden="true" />
            Cerrar
          </Button>
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button>
                  <KeyRound aria-hidden="true" />
                  Introducir código
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Código de activación</AlertDialogTitle>
                <AlertDialogDescription>
                  Introduce el código que recibiste para activar el producto.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex flex-col gap-2">
                <Label htmlFor="activation-key">Código</Label>
                <Input
                  id="activation-key"
                  placeholder="XXXXXX"
                  maxLength={6}
                  minLength={6}
                  autoFocus
                  className="text-center text-base tracking-[0.4em]"
                  ref={inputRef}
                  onChange={(e) => setKey(e.target.value)}
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={active} disabled={loading || key.length < 6}>
                  Aceptar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </section>
    </main>
  )
}
