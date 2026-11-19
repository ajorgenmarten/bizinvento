import { Boxes, Package, TrendingUp, Wallet, Warehouse as WarehouseIcon } from 'lucide-react'
import { JSX } from 'react/jsx-runtime'
import AddProduct from './components/add-product'
import InfoCard from './components/info-card'
import Table from './components/table'
import { FilterProductsProvider } from './contexts/filter-products'
import { useEffect, useState } from 'react'
import Layout from '@renderer/components/common/layout'
import { formatMoneyExact, formatNumber } from '@renderer/lib/format'

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
        title="Almacén"
        description="Administra productos, existencias y costos de importación."
        icon={WarehouseIcon}
        sideElement={<AddProduct />}
      >
        <section
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          aria-label="Resumen del inventario"
        >
          <InfoCard info="Productos" value={formatNumber(stats.products)} icon={Package} />
          <InfoCard
            info="Unidades en stock"
            value={formatNumber(stats.itemsInStock)}
            icon={Boxes}
          />
          <InfoCard
            info="Valor de venta"
            value={formatMoneyExact(stats.totalSales)}
            icon={TrendingUp}
          />
          <InfoCard
            info="Costo de inventario"
            value={formatMoneyExact(stats.inventoryCosts || 0)}
            icon={Wallet}
          />
        </section>
        <Table />
      </Layout>
    </FilterProductsProvider>
  )
}
