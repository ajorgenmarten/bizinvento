import SQLite from '@/main/commons/services/db'
import { Injectable } from 'electron-injector'
import Order from '../types/classes/order'
import { IMovement, IOrder } from '../types/interfaces'

export type GetOrdersReturnType = { results: IOrder[]; totalItems: number }

export type MovementWithProduct = IMovement & { productName: string }

export type GetSalesStatsReturnType = {
  totalRevenue: number
  totalOrders: number
  totalUnits: number
  averageTicket: number
  cashRevenue: number
  cardRevenue: number
}

@Injectable()
export default class SalesRepository {
  constructor(private readonly SQLite: SQLite) {}

  getOrders(page: number, pageSize: number, search = ''): GetOrdersReturnType {
    const term = search.trim()
    const where = term ? `WHERE type = 'export' AND id LIKE ?` : `WHERE type = 'export'`
    const params = term ? [`%${term}%`] : []

    const { totalItems } = this.SQLite.prepare(
      `SELECT COUNT(id) as totalItems FROM \`Order\` ${where}`
    ).get(...params) as { totalItems: number }

    const results = this.SQLite.prepare(
      `SELECT * FROM \`Order\` ${where} ORDER BY createdAt DESC LIMIT ? OFFSET ?`
    ).all(...params, pageSize, page * pageSize) as IOrder[]

    return { results, totalItems }
  }

  getOrderById(id: string): Order | null {
    const order = this.SQLite.prepare('SELECT * FROM `Order` WHERE id = ?').get(id) as IOrder | null
    if (!order) return null
    return Order.fromDatabase(order)
  }

  getMovementOfOrder(id: string): MovementWithProduct[] {
    return this.SQLite.prepare(
      `SELECT m.*, COALESCE(p.name, 'Producto eliminado') as productName
       FROM Movement m
       LEFT JOIN Product p ON p.id = m.productId
       WHERE m.orderId = ?
       ORDER BY p.name ASC`
    ).all(id) as MovementWithProduct[]
  }

  getStats(): GetSalesStatsReturnType {
    const orderStats = this.SQLite.prepare(
      `SELECT
         COUNT(id) as totalOrders,
         COALESCE(SUM(totalPrice), 0) as totalRevenue,
         COALESCE(SUM(CASE WHEN paymentType = 'cash' THEN totalPrice ELSE 0 END), 0) as cashRevenue,
         COALESCE(SUM(CASE WHEN paymentType = 'card' THEN totalPrice ELSE 0 END), 0) as cardRevenue
       FROM \`Order\`
       WHERE type = 'export'`
    ).get() as Omit<GetSalesStatsReturnType, 'totalUnits' | 'averageTicket'>

    const { totalUnits } = this.SQLite.prepare(
      `SELECT COALESCE(SUM(m.quantity), 0) as totalUnits
       FROM Movement m
       INNER JOIN \`Order\` o ON o.id = m.orderId
       WHERE o.type = 'export'`
    ).get() as { totalUnits: number }

    return {
      ...orderStats,
      totalUnits,
      averageTicket: orderStats.totalOrders ? orderStats.totalRevenue / orderStats.totalOrders : 0
    }
  }
}
