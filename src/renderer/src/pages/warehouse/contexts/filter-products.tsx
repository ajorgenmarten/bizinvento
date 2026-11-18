import {
  useContext,
  createContext,
  JSX,
  PropsWithChildren,
  useState,
  useCallback,
  useEffect,
  Dispatch,
  SetStateAction
} from 'react'

const FilterProductsContext = createContext<ReturnType<typeof useFilterProductHook>>({
  page: 0,
  products: { totalItems: 0, totalPages: 0, page: 1, result: [] },
  search: '',
  refresh: async () => {},
  setPage: () => {},
  setSearch: () => {}
})

// eslint-disable-next-line
const useFilterProduct = () => useContext(FilterProductsContext)

type IProduct = {
  id: string
  name: string
  slug: string
  price: number
  quantity: number
  importCost: number
  createdAt: string
  updatedAt: string
}

type ProductState = {
  totalItems: number
  totalPages: number
  page: number
  result: IProduct[]
}

const useFilterProductHook = (): {
  page: number
  products: ProductState
  refresh: () => Promise<void>
  setPage: Dispatch<SetStateAction<number>>
  setSearch: Dispatch<SetStateAction<string>>
  search: string
} => {
  const [products, setProducts] = useState<ProductState>({
    totalItems: 0,
    totalPages: 0,
    page: 0,
    result: []
  })
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const filterProducts = useCallback(async (page: number, search: string) => {
    const results = await window.electron.ipcRenderer.invoke('warehouse:filter-products', {
      page,
      search
    })
    return results
  }, [])

  const refresh = useCallback(() => filterProducts(page, search).then(setProducts), [])

  useEffect(() => {
    filterProducts(page, search).then(setProducts)
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => filterProducts(page, search).then(setProducts), 250)
    return () => {
      clearTimeout(timeout)
    }
  }, [search])

  useEffect(() => {
    filterProducts(page, search).then(setProducts)
  }, [page])

  return { page, products, setPage, setSearch, refresh, search }
}

function FilterProductsProvider(props: PropsWithChildren): JSX.Element {
  return (
    <FilterProductsContext.Provider value={useFilterProductHook()}>
      {props.children}
    </FilterProductsContext.Provider>
  )
}

// eslint-disable-next-line
export { FilterProductsContext, FilterProductsProvider, useFilterProduct }
