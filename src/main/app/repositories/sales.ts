import SQLite from '@/main/commons/services/db'
import { Injectable } from 'electron-injector'
import Order from '../types/classes/order'
import { IMovement, IOrder } from '../types/interfaces'

export type GetOrdersReturnType = { results: IOrder[]; totalItems: number }

@Injectable()
export default class SalesRepository {
  constructor(private readonly SQLite: SQLite) {}

  getOrders(page: number, pageSize: number): GetOrdersReturnType {
    const { totalItems } = this.SQLite.prepare(
      'SELECT COUNT(id) as totalItems FROM `Order`'
    ).get() as { totalItems: number }
    const results = this.SQLite.prepare('SELECT * FROM `Order` LIMIT ? OFFSET ?').all(
      pageSize,
      page * pageSize
    ) as IOrder[]
    return { results, totalItems }
  }

  getOrderById(id: string): Order | null {
    const order = this.SQLite.prepare('SELECT * FROM `Order` WHERE id = ?').get(id) as IOrder | null
    if (!order) return null
    return Order.fromDatabase(order)
  }

  getMovementOfOrder(id: string): IMovement[] {
    return this.SQLite.prepare('SELECT * FROM Movement WHERE orderId = ?').all(id) as IMovement[]
  }
}
