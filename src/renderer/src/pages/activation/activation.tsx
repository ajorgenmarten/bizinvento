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
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <section
        className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-10"
        aria-labelledby="license-title"
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <KeyRound aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Activación
              </p>
              <h1 id="license-title" className="text-2xl font-semibold tracking-tight">
                Activa tu licencia
              </h1>
              <p className="max-w-md text-sm leading-6 text-muted-foreground">
                Escanea el código QR desde tu dispositivo autorizado o comparte su contenido para
                completar la activación.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-[240px_1fr] md:items-center">
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-xl border border-border bg-white p-2">
              <QRCode value={qrPayload} />
            </div>
            <p className="text-xs text-muted-foreground">Código QR de activación</p>
          </div>

          <div className="flex min-w-0 flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="qr-content" className="text-sm font-medium">
                Contenido del código QR
              </label>
              <div className="flex items-stretch gap-2">
                <textarea
                  id="qr-content"
                  readOnly
                  value={qrPayload}
                  rows={4}
                  className="min-w-0 flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm leading-6 text-foreground outline-none"
                />
                <button
                  type="button"
                  onClick={copyPayload}
                  aria-label="Copiar contenido del código QR"
                  className="inline-flex size-10 shrink-0 items-center justify-center self-start rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {copied ? <Check aria-hidden="true" /> : <Clipboard aria-hidden="true" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                {copied
                  ? 'Contenido copiado.'
                  : 'Copia este texto para enviarlo a soporte o a otro dispositivo.'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
          <button
            onClick={exit}
            type="button"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X aria-hidden="true" />
            Cerrar
          </button>
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button className="px-5 font-medium h-11 text-sm">
                  <KeyRound aria-hidden="true" />
                  Introducir código
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="font-extrabold">Código de activación</AlertDialogTitle>
                <AlertDialogDescription>
                  Introduce el código que recibiste para activar el producto.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div>
                <Label className="font-bold mb-2">Código:</Label>
                <Input
                  placeholder="XXXXXX"
                  maxLength={6}
                  minLength={6}
                  ref={inputRef}
                  onChange={(e) => setKey(e.target.value)}
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={loading}>Cerrar</AlertDialogCancel>
                <AlertDialogAction onClick={active} disabled={loading || key.length < 6}>
                  Acepter
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </section>
    </main>
  )
}
