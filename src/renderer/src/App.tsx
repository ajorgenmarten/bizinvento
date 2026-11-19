import { JSX } from 'react/jsx-runtime'
import Home from './pages/home/home'
import { Routes, Route, BrowserRouter } from 'react-router'
import Activation from './pages/activation/activation'
import { SecureProvider } from './contexts/secure/provider'
import IsActive from './contexts/secure/components/is-active'
import NotActive from './contexts/secure/components/not-active'
import Warehouse from './pages/warehouse/warehouse'
import POS from './pages/pos/pos'
import { FilterProductsProvider } from './pages/warehouse/contexts/filter-products'
import Settings from './pages/settings/settings'
import Sales from './pages/sales/sales'

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <SecureProvider>
        <Routes>
          <Route
            path="/"
            element={
              <IsActive>
                <Home />
              </IsActive>
            }
          />
          <Route
            path="activation"
            element={
              <NotActive>
                <Activation />
              </NotActive>
            }
          />
          <Route
            path="warehouse"
            element={
              <IsActive>
                <Warehouse />
              </IsActive>
            }
          />
          <Route
            path="pos"
            element={
              <IsActive>
                <FilterProductsProvider>
                  <POS />
                </FilterProductsProvider>
              </IsActive>
            }
          />
          <Route
            path="settings"
            element={
              <IsActive>
                <Settings />
              </IsActive>
            }
          />
          <Route
            path="sales"
            element={
              <IsActive>
                <Sales />
              </IsActive>
            }
          />
        </Routes>
      </SecureProvider>
    </BrowserRouter>
  )
}
