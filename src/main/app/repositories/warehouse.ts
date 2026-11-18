import SQLite from '@/main/commons/services/db'
import { Injectable } from 'electron-injector'
import Product from '../types/classes/product'
import { generateSlug } from '@/main/commons/helpers'
import { IImportInformation, IMovement, IOrder, IProduct } from '../types/interfaces'
import Order from '../types/classes/order'
import FilterProductsDto from '../dtos/warehosue/filter-products.dto'
import ImportInformation from '../types/classes/import-information'
import Movement from '../types/classes/movement'

@Injectable()
export default class WarehouseRepository {
  constructor(private readonly SQLite: SQLite) {}

  findProductByName(data: string): Product | null {
    const slug = generateSlug(data)
    const product = this.SQLite.prepare('SELECT * FROM Product WHERE slug = ?').get([slug])
    if (!product) return null
    return Product.fromDatabase(product as IProduct)
  }

  addProductTransaction(product: Product, order: Order): void {
    const addProductStatement = this.SQLite.prepare(
      'INSERT INTO Product VALUES (@id, @name, @slug, @quantity, @price, @createdAt, @updatedAt)'
    )
    const addOrderStatement = this.SQLite.prepare(
      'INSERT INTO `Order` (id, totalPrice, type, paymentType, createdAt) VALUES (@id, @totalPrice, @type, @paymentType, @createdAt)'
    )
    const addMovementStatement = this.SQLite.prepare(
      'INSERT INTO Movement VALUES (@id, @productId, @currentPrice, @quantity, @orderId)'
    )
    const transaction = this.SQLite.transaction(() => {
      addProductStatement.run(product.toObject())
      addOrderStatement.run(order.toObject())
      order.Movements.forEach((movement) => {
        addMovementStatement.run(movement.toObject())
      })
    })

    transaction()
  }

  getInvolvedMovementsOfProduct(id: string): Movement[] {
    const movements = this.SQLite.prepare(`SELECT * FROM Movement WHERE productId = ?`).all(
      id
    ) as IMovement[]
    return movements.map((m) => Movement.fromDatabase(m))
  }

  getRelatedOrdersToMovements(movements: IMovement[]): Order[] {
    const ids = movements.map((m) => m.orderId)
    const orders = this.SQLite.prepare(
      `SELECT * FROM 'Order' WHERE id IN (${ids.map(() => '?').join(', ')})`
    ).all(...ids) as IOrder[]
    return orders.map((o) => Order.fromDatabase(o))
  }

  findProductById(id: string): Product | null {
    const result = this.SQLite.prepare('SELECT * FROM Product WHERE id = ?').get(id)

    if (!result) return null

    return Product.fromDatabase(result as IProduct)
  }

  getInventoryCosts(): number {
    const result = this.SQLite.prepare(
      'SELECT SUM(info.cost * info.quantity) as cost FROM ImportInformation as info'
    ).get() as { cost: number }

    if (!result) return 0

    return result.cost
  }

  updateProductTransaction(product: Product, order: Order): void {
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
      order.Movements.forEach((movement) => {
        addMovementStatement.run(movement.toObject())
      })
      updateProductStatement.run(product.quantity, product.price, product.updatedAt, product.id)
    })

    transaction()
  }

  countProducts(): number {
    const { totalItems } = this.SQLite.prepare(
      'SELECT COUNT(id) AS totalItems FROM Product'
    ).get() as {
      totalItems: number
    }
    return totalItems
  }

  countItemsInStock(): number {
    const { totalItems } = this.SQLite.prepare(
      'SELECT SUM(quantity) AS totalItems FROM Product WHERE quantity > 0'
    ).get() as { totalItems: number }
    return totalItems || 0
  }

  getSalesValueInStock(): number {
    const { totalSales } = this.SQLite.prepare(
      'SELECT SUM(price * quantity) AS totalSales FROM Product'
    ).get() as { totalSales: number }
    return totalSales || 0
  }

  getLastImportCostOfProduct(id: string): number {
    const result = this.SQLite.prepare(
      `
      SELECT Movement.currentPrice as importCost FROM Movement
      INNER JOIN 'Order'
      ON Movement.orderId = 'Order'.id
      WHERE Movement.productId = @productId AND 'Order'.type = 'import'
      ORDER BY 'Order'.createdAt DESC
      LIMIT 1
    `
    ).get({ productId: id }) as { importCost: number }
    return result.importCost
  }

  getLastImportInfo(productId: string): ImportInformation | null {
    const lastInfo = this.SQLite.prepare(
      `
          SELECT * FROM ImportInformation
          WHERE productId = ?
          ORDER BY createdAt DESC
          LIMIT 1
        `
    ).get(productId) as IImportInformation | undefined

    if (!lastInfo) return null

    return ImportInformation.fromDatabase(lastInfo)
  }

  addImportInformation(importInformation: ImportInformation): void {
    this.SQLite.prepare(
      `
      INSERT INTO ImportInformation
      VALUES (@id, @productId, @cost, @quantity, @createdAt)
    `
    ).run(importInformation.toObject())
  }

  updateImportInformation(importInformation: ImportInformation): void {
    this.SQLite.prepare(
      `
          UPDATE ImportInformation SET quantity = ? WHERE id = ?
        `
    ).run(importInformation.quantity, importInformation.id)
  }

  updateProduct(product: Product): void {
    this.SQLite.prepare(`UPDATE Product SET name = ?, slug = ?, price = ? WHERE id = ?`).run(
      product.name,
      product.slug,
      product.price,
      product.id
    )
  }

  deleteProductTransaction(
    movements: IMovement[],
    ordersIdToDelete: string[],
    ordersToUpdate: IOrder[],
    productId: string
  ): void {
    const transaction = this.SQLite.transaction(() => {
      const deleteInformation = this.SQLite.prepare(
        `DELETE FROM ImportInformation WHERE productId = ?`
      )
      const deleteMovement = this.SQLite.prepare(
        `DELETE FROM Movement WHERE id IN (${movements.map(() => '?').join(', ')})`
      )
      const deleteOrder = this.SQLite.prepare(
        `DELETE FROM 'Order' WHERE id IN (${ordersIdToDelete.map(() => '?').join(', ')})`
      )
      const updateOrder = this.SQLite.prepare(`UPDATE 'Order' SET totalPrice = ? WHERE id = ?`)
      const deleteProduct = this.SQLite.prepare(`DELETE FROM Product WHERE id = ?`)

      deleteInformation.run(productId)
      deleteMovement.run(...movements.map((m) => m.id))
      for (const orderToUpdate of ordersToUpdate)
        updateOrder.run(orderToUpdate.totalPrice, orderToUpdate.id)
      deleteOrder.run(...ordersIdToDelete)
      deleteProduct.run(productId)
    })

    transaction()
  }

  /**
   * Deprecated: Metodo de esclarecimiento
   */
  deleteProductTransactionDeprecated(id: string): void {
    const movementsOfProduct = this.SQLite.prepare(
      `SELECT * FROM Movement WHERE productId = ?`
    ).all(id) as IMovement[]
    const movementsIds = movementsOfProduct.map((m) => m.id)
    const deleteProduct = this.SQLite.prepare(`DELETE FROM Product WHERE id = ?`)
    const deleteInformation = this.SQLite.prepare(
      `DELETE FROM ImportInformation WHERE productId = ?`
    )
    const deleteMovements = this.SQLite.prepare(
      `DELETE FROM Movement WHERE id IN (${movementsIds.map(() => '?').join(', ')})`
    )

    const ordersIds = movementsOfProduct.map((m) => m.id)
    const orders = (
      this.SQLite.prepare(
        `SELECT * FROM 'Order' WHERE id IN (${ordersIds.map(() => '?').join(', ')})`
      ).all(ordersIds) as IOrder[]
    ).map((order) => Order.fromDatabase(order))
    const ordersToDelete: string[] = []
    const ordersToUpdate: Order[] = []

    for (const movement of movementsOfProduct) {
      const order = orders.find((order) => order.id == movement.orderId)
      if (!order) continue
      order.restToTotalPrice(movement.quantity * movement.currentPrice)
      if (order.totalPrice <= 0) ordersToDelete.push(order.id)
      else ordersToUpdate.push(order)
    }

    const deleteOrders = this.SQLite.prepare(
      `DELETE FROM 'Order' WHERE id IN (${ordersToDelete.join(', ')})`
    )
    const updateOrder = this.SQLite.prepare(`UPDATE 'Order' SET totalPrice = ?, WHERE id = ?`)

    const transaction = this.SQLite.transaction(() => {
      deleteInformation.run(id)
      deleteMovements.run(id)
      deleteOrders.run()
      for (const order of ordersToUpdate) updateOrder.run(order.totalPrice, order.id)
      deleteProduct.run(id)
    })

    transaction()
  }

  filterProducts(data: FilterProductsDto): {
    totalItems: number
    totalPages: number
    page: number
    result: IProduct[]
  } {
    const limit = 20
    const page = data.page || 1
    const offset = (page - 1) * limit
    const search = `%${generateSlug(data.search || '')}%`

    const queryCount =
      'SELECT COUNT(id) as totalItems FROM Product WHERE quantity > 0 AND slug LIKE ? '
    const querySelect = `SELECT * FROM Product WHERE quantity > 0 AND slug LIKE ? `
    const queryOffset = 'LIMIT ? OFFSET ?'

    const { totalItems } = this.SQLite.prepare(`${queryCount}`).get(search) as {
      totalItems: number
    }
    const totalPages = Math.ceil(totalItems / limit)

    const result = (
      this.SQLite.prepare(`${querySelect}${queryOffset}`).all(search, limit, offset) as IProduct[]
    ).map((product) => {
      const importCost = this.getLastImportCostOfProduct(product.id)
      return { importCost, ...product }
    })

    return { totalItems, totalPages, result, page }
  }
}
