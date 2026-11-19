import Layout from '@renderer/components/common/layout'
import { JSX } from 'react/jsx-runtime'
import { CalendarDays, ChartColumnStackedIcon, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router'
import { Button, buttonVariants } from '@renderer/components/ui/button'

export default function Sales(): JSX.Element {
  return (
    <Layout
      backButton
      description="Gestión comercial"
      title="Ventas"
      icon={ChartColumnStackedIcon}
      sideElement={
        <div className="flex gap-2">
          <Link to="/pos" className={buttonVariants({ variant: 'outline' })}>
            <ShoppingCart data-icon="inline-start" />
            Ir al POS
          </Link>
          <Button variant="outline">
            <CalendarDays data-icon="inline-start" />
            Exportar
          </Button>
        </div>
      }
    >
      Este modulo está en desarrollo...
    </Layout>
  )
}
