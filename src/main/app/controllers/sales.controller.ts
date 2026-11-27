import { Controller, OnInvoke, Payload } from 'electron-injector'
import GetOrdersDto from '../dtos/sales/get-orders.dto'
import SalesService from '../services/sales.service'
import {
  type GetOrdersReturnType,
  type GetSalesStatsReturnType,
  type MovementWithProduct
} from '../repositories/sales'
import GetMovementsOfOrderDto from '../dtos/sales/get-movements-of-order.dto'

@Controller('sales')
export default class SalesController {
  constructor(private readonly SalesService: SalesService) {}

  @OnInvoke('orders')
  getOrders(@Payload() payload: GetOrdersDto): GetOrdersReturnType {
    return this.SalesService.getOrders(payload)
  }

  @OnInvoke('get-movements-of-order')
  getMovementsOfOrders(@Payload() payload: GetMovementsOfOrderDto): MovementWithProduct[] {
    return this.SalesService.getMovementsOfOrders(payload)
  }

  @OnInvoke('stats')
  getStats(): GetSalesStatsReturnType {
    return this.SalesService.getStats()
  }
}
