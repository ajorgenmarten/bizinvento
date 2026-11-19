import { Warehouse as WarehouseIcon } from 'lucide-react'
import { JSX } from 'react/jsx-runtime'
import AddProduct from './components/add-product'
import InfoCard from './components/info-card'
import Table from './components/table'
import { FilterProductsProvider } from './contexts/filter-products'
import { useEffect, useState } from 'react'
import Layout from '@renderer/components/common/layout'

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
      <Layout
        backButton
        title="Almacén"
        description="Administra productos, existencias y costos de importación."
        icon={WarehouseIcon}
        sideElement={<AddProduct />}
      >
        <section
          className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 md:px-8 md:py-8"
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
        <div className="md:px-8">
          <Table />
        </div>
      </Layout>
    </FilterProductsProvider>
  )
}
