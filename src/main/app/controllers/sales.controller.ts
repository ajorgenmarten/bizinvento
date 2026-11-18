import { Controller, OnInvoke, Payload } from 'electron-injector'
import GetOrdersDto from '../dtos/sales/get-orders.dto'
import SalesService from '../services/sales.service'
import { type GetOrdersReturnType } from '../repositories/sales'
import GetMovementsOfOrderDto from '../dtos/sales/get-movements-of-order.dto'
import Movement from '../types/classes/movement'

@Controller('sales')
export default class SalesController {
  constructor(private readonly SalesService: SalesService) {}

  @OnInvoke('orders')
  getOrders(@Payload() payload: GetOrdersDto): GetOrdersReturnType {
    return this.SalesService.getOrders(payload)
  }

  @OnInvoke('get-movements-of-order')
  getMovementsOfOrders(@Payload() payload: GetMovementsOfOrderDto): Movement[] {
    return this.SalesService.getMovementsOfOrders(payload)
  }
}
