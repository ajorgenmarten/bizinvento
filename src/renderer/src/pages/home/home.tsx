import { Package, ScanLine, Settings, TrendingUp } from 'lucide-react'
import { JSX, useEffect } from 'react'
import MenuItem from './components/menu-item'
import AppHeader from '@renderer/components/common/app-header'

const items = [
  {
    label: 'Ventas',
    description: 'Registro y reportes',
    href: '/sales',
    icon: TrendingUp
  },
  {
    label: 'POS',
    description: 'Punto de venta',
    href: '/pos',
    icon: ScanLine
  },
  {
    label: 'Almacén',
    description: 'Inventario y stock',
    href: '/warehouse',
    icon: Package
  },
  {
    label: 'Ajustes',
    description: 'Configuración del sistema',
    href: '/settings',
    icon: Settings
  }
]

function greeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos días'
  if (hour < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

function today(): string {
  const formatted = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date())
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

export default function Home(): JSX.Element {
  useEffect(() => {
    document.title = 'BizInvento - Panel principal'
  }, [])

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-4xl flex-col justify-center px-6 py-16">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground/80">
            {today()}
          </p>
          <h1 className="mt-3 text-[34px] font-semibold leading-[1.1] tracking-tight text-balance sm:text-[42px]">
            {greeting()}.
          </h1>
          <p className="mt-2 text-[15px] text-muted-foreground">
            ¿Qué quieres hacer hoy? Selecciona un módulo para comenzar.
          </p>
        </div>

        <nav
          aria-label="Módulos"
          className="mt-10 grid animate-in fade-in grid-cols-1 gap-3 duration-700 sm:grid-cols-2"
        >
          {items.map((item, index) => (
            <MenuItem
              key={item.label}
              description={item.description}
              href={item.href}
              icon={item.icon}
              label={item.label}
              index={String(index + 1).padStart(2, '0')}
            />
          ))}
        </nav>

        <footer className="mt-12 flex items-center justify-between text-[11px] text-muted-foreground/70">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-brand" />
            Todo listo
          </span>
          <span>BizInvento · v1.0.0</span>
        </footer>
      </main>
    </div>
  )
}
