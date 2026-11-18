import { Injectable } from 'electron-injector'
import GetOrdersDto from '../dtos/sales/get-orders.dto'
import SalesRepository, { GetOrdersReturnType } from '../repositories/sales'
import GetMovementsOfOrderDto from '../dtos/sales/get-movements-of-order.dto'
import Movement from '../types/classes/movement'

@Injectable()
export default class SalesService {
  constructor(private readonly SalesRepository: SalesRepository) {}

  getOrders(data: GetOrdersDto): GetOrdersReturnType {
    const pageSize = 20
    const page = data.page || 0
    return this.SalesRepository.getOrders(page, pageSize)
  }

  getMovementsOfOrders(data: GetMovementsOfOrderDto): Movement[] {
    const order = this.SalesRepository.getOrderById(data.orderId)
    if (!order) throw new Error(`Orden no encontrada`)

    const movements = this.SalesRepository.getMovementOfOrder(order.id)
    return movements
  }
}
