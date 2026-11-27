import { Injectable } from 'electron-injector'
import GetOrdersDto from '../dtos/sales/get-orders.dto'
import SalesRepository, {
  GetOrdersReturnType,
  GetSalesStatsReturnType,
  MovementWithProduct
} from '../repositories/sales'
import GetMovementsOfOrderDto from '../dtos/sales/get-movements-of-order.dto'

@Injectable()
export default class SalesService {
  constructor(private readonly SalesRepository: SalesRepository) {}

  getOrders(data: GetOrdersDto): GetOrdersReturnType {
    const pageSize = 20
    const page = data.page || 0
    return this.SalesRepository.getOrders(page, pageSize, data.search)
  }

  getMovementsOfOrders(data: GetMovementsOfOrderDto): MovementWithProduct[] {
    const order = this.SalesRepository.getOrderById(data.orderId)
    if (!order) throw new Error(`Orden no encontrada`)

    return this.SalesRepository.getMovementOfOrder(order.id)
  }

  getStats(): GetSalesStatsReturnType {
    return this.SalesRepository.getStats()
  }
}
