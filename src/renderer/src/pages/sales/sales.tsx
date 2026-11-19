import Layout from '@renderer/components/common/layout'
import { JSX } from 'react/jsx-runtime'
import { useEffect } from 'react'
import { ChartColumnStacked, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router'
import { Badge } from '@renderer/components/ui/badge'
import { buttonVariants } from '@renderer/components/ui/button'

export default function Sales(): JSX.Element {
  useEffect(() => {
    document.title = 'BizInvento - Ventas'
  }, [])

  return (
    <Layout
      title="Ventas"
      description="Consulta el rendimiento de tu negocio."
      icon={ChartColumnStacked}
    >
      <div className="relative flex flex-col items-center overflow-hidden rounded-2xl border border-border/70 bg-card/40 px-6 py-20 text-center">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full bg-brand-soft blur-3xl"
        />
        <span className="relative grid size-12 place-items-center rounded-xl border border-border/70 bg-card text-muted-foreground">
          <ChartColumnStacked className="size-5" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <h2 className="relative mt-5 text-lg font-medium tracking-tight">
          Este módulo está en camino
        </h2>
        <p className="relative mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Pronto podrás consultar aquí tus ventas, ganancias por periodo y movimientos de caja.
        </p>
        <div className="relative mt-6 flex items-center gap-2">
          <Link to="/pos" className={buttonVariants({ size: 'lg' })}>
            <ShoppingCart data-icon="inline-start" aria-hidden="true" />
            Ir al punto de venta
          </Link>
          <Badge variant="outline" className="text-muted-foreground">
            Próximamente
          </Badge>
        </div>
      </div>
    </Layout>
  )
}
