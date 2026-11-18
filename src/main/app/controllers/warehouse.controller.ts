import { Controller, OnInvoke, Payload } from 'electron-injector'
import AddProductDto from '../dtos/warehosue/add-product.dto'
import WarehouseService, { type GetStatsOutput } from '../services/warehouse.service'
import { type IProduct } from '../types/interfaces'
import FilterProductsDto from '../dtos/warehosue/filter-products.dto'
import AddMoreDto from '../dtos/warehosue/add-more.dto'
import EditProductDto from '../dtos/warehosue/edit-product.dto'
import DeleteProductDto from '../dtos/warehosue/delete-product.dto'
import HouseAccountDto from '../dtos/warehosue/house-account.dto'

@Controller('warehouse')
export default class WarehouseController {
  constructor(private readonly WarehouseService: WarehouseService) {}

  @OnInvoke('add-product')
  addProduct(@Payload() payload: AddProductDto): IProduct {
    return this.WarehouseService.addProduct(payload)
  }

  @OnInvoke('filter-products')
  filterProducts(@Payload() payload: FilterProductsDto): {
    totalItems: number
    totalPages: number
    page: number
    result: IProduct[]
  } {
    return this.WarehouseService.filterProducts(payload)
  }

  @OnInvoke('edit-product')
  editProduct(@Payload() payload: EditProductDto): void {
    return this.WarehouseService.editProduct(payload)
  }

  @OnInvoke('get-stats')
  getStats(): GetStatsOutput {
    return this.WarehouseService.getStats()
  }

  @OnInvoke('add-more')
  addMore(@Payload() payload: AddMoreDto): void {
    return this.WarehouseService.addMore(payload)
  }

  @OnInvoke('delete-product')
  deleteProduct(@Payload() payload: DeleteProductDto): void {
    return this.WarehouseService.deleteProduct(payload)
  }

  @OnInvoke('house-account')
  houseAccount(@Payload() payload: HouseAccountDto): void {
    return this.WarehouseService.houseAccount(payload)
  }
}
