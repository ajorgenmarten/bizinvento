import { Package, ScanLine, Settings, TrendingUp } from 'lucide-react'
import { JSX } from 'react/jsx-runtime'
import MenuItem from './components/menu-item'
import { useEffect } from 'react'

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

export default function Home(): JSX.Element {
  useEffect(() => {
    document.title = 'BizInvento - Home'
  }, [])
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16 dark:bg-black">
      <div className="w-full max-w-3xl">
        <header className="mb-10">
          <div className="text-4xl font-bold text-gray-600 text-center mb-28">BizInvento</div>
          <h1 className="text-2-xl font-medium tracking-tight text-balance dark:text-white">
            Panel principal
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Selecciona un modulo para comenzar</p>
        </header>
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {items.map((item) => (
            <MenuItem
              key={item.label}
              description={item.description}
              href={item.href}
              icon={item.icon}
              label={item.label}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
