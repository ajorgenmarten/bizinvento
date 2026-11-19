import { Link, useLocation } from 'react-router'
import { JSX } from 'react/jsx-runtime'
import Brand from './brand'
import { cn } from '@renderer/lib/utils'
import { useSecure } from '@renderer/contexts/secure/provider'

const navigation = [
  { label: 'POS', href: '/pos' },
  { label: 'Almacén', href: '/warehouse' },
  { label: 'Ventas', href: '/sales' },
  { label: 'Ajustes', href: '/settings' }
]

export default function AppHeader(): JSX.Element {
  const { pathname } = useLocation()
  const { status } = useSecure()

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-6">
        <Brand to="/" />

        <nav aria-label="Navegación principal" className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                to={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60',
                  isActive
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <span className="hidden items-center gap-1.5 rounded-full border border-border/70 px-2.5 py-1 text-[11px] font-medium text-muted-foreground sm:inline-flex">
            <span
              className={cn(
                'size-1.5 rounded-full',
                status === 'active'
                  ? 'bg-brand shadow-[0_0_8px_var(--brand)]'
                  : 'bg-muted-foreground'
              )}
            />
            {status === 'active' ? 'Licencia activa' : 'Licencia inactiva'}
          </span>
        </div>
      </div>
    </header>
  )
}
