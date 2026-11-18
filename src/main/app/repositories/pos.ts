import SQLite from '@/main/commons/services/db'
import { Injectable } from 'electron-injector'
import Product from '../types/classes/product'
import { IImportInformation, IProduct } from '../types/interfaces'
import Order from '../types/classes/order'
import ImportInformation from '../types/classes/import-information'
import BudgetMovementRepository from './budget-movement'
import BudgetMovement from '../types/classes/budget-movement'

@Injectable()
export default class PosRepository {
  constructor(
    private readonly SQLite: SQLite,
    private readonly BudgetMovementRepository: BudgetMovementRepository
  ) {}

  getProducts(ids: string[]): Product[] {
    const inSection = Array.from({ length: ids.length })
      .map(() => '?')
      .join(', ')
    const query = `SELECT * FROM Product WHERE id IN (${inSection}) AND quantity > 0`

    const products = this.SQLite.prepare(query).all(ids) as IProduct[]
    return products.map((product) => Product.fromDatabase(product))
  }

  saleTransaction(products: Product[], order: Order): void {
    const addOrderStatement = this.SQLite.prepare(
      'INSERT INTO `Order` (id, totalPrice, type, paymentType, createdAt) VALUES (@id, @totalPrice, @type, @paymentType, @createdAt)'
    )
    const addMovementStatement = this.SQLite.prepare(
      'INSERT INTO Movement VALUES (@id, @productId, @currentPrice, @quantity, @orderId)'
    )
    const updateProductStatement = this.SQLite.prepare(
      'UPDATE Product SET quantity = ?, price = ?, updatedAt = ? WHERE id = ?'
    )
    const transaction = this.SQLite.transaction(() => {
      addOrderStatement.run(order.toObject())
      order.Movements.forEach((m) => addMovementStatement.run(m.toObject()))
      products.forEach((p) => updateProductStatement.run(p.quantity, p.price, p.updatedAt, p.id))
      if (order.paymentType === 'cash')
        this.BudgetMovementRepository.addBudgetMovement(
          BudgetMovement.new('in', order.totalPrice, 'Punto de venta')
        )
    })

    transaction()
  }

  getImportInformation(product: Product): ImportInformation[] {
    const result = this.SQLite.prepare(
      `
      SELECT * FROM ImportInformation
      WHERE productId = ?
      ORDER BY createdAt ASC
    `
    ).all(product.id) as IImportInformation[]

    return result.map((i) => ImportInformation.fromDatabase(i))
  }

  updateImportInformation(importInformation: IImportInformation): void {
    this.SQLite.prepare(
      `
      UPDATE ImportInformation SET quantity = ? WHERE id = ?
    `
    ).run(importInformation.quantity, importInformation.id)
  }

  deleteImportInformation(importInformation: IImportInformation): void {
    this.SQLite.prepare(
      `
      DELETE FROM ImportInformation WHERE id = ?
    `
    ).run(importInformation.id)
  }
}
