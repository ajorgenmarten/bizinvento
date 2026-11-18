import { Button } from '@renderer/components/ui/button'
import { ArrowLeft, Warehouse as WarehouseIcon } from 'lucide-react'
import { Link } from 'react-router'
import { JSX } from 'react/jsx-runtime'
import AddProduct from './components/add-product'
import InfoCard from './components/info-card'
import Table from './components/table'
import { FilterProductsProvider } from './contexts/filter-products'
import { useEffect, useState } from 'react'

export default function Warehouse(): JSX.Element {
  const [stats, setStats] = useState({
    products: 0,
    itemsInStock: 0,
    totalSales: 0,
    inventoryCosts: 0
  })
  useEffect(() => {
    document.title = 'BizInvento - Almacén'
    window.electron.ipcRenderer.invoke('warehouse:get-stats').then(setStats)
  }, [])
  return (
    <FilterProductsProvider>
      <main className="min-h-screen px-6 py-8 md:px-10 dark:bg-black">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
          <header className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon" aria-label="Volver al panel principal">
                  <ArrowLeft data-icon="inline-start" className="dark:text-white/90" />
                </Button>
              </Link>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <WarehouseIcon data-icon="inline-start" />
                  <span className="text-xs font-medium uppercase tracking-[0.18em]">Módulo</span>
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-balance dark:text-white">
                  Almacén
                </h1>
                <p className="text-sm text-muted-foreground">
                  Administra productos, existencias y costos de importación.
                </p>
              </div>
            </div>
            <AddProduct />
          </header>
          <section
            className="grid gap-4 sm:grid-cols-2 md:grid-cols-4"
            aria-label="Resumen del inventario"
          >
            <InfoCard info="Productos registrados" value={stats.products.toString()} />
            <InfoCard info="Unidades en stock" value={stats.itemsInStock.toString()} />
            <InfoCard info="Valor de venta en stock" value={'$ ' + stats.totalSales.toString()} />
            <InfoCard
              info="Valor de inventario"
              value={'$ ' + (stats.inventoryCosts || 0).toFixed(2).toString()}
            />
          </section>
          <Table />
        </div>
      </main>
    </FilterProductsProvider>
  )
}
