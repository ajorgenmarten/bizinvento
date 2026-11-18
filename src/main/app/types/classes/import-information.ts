import { IImportInformation } from '../interfaces'
import Product from './product'

export default class ImportInformation implements IImportInformation {
  constructor(
    private readonly _id: string,
    private _productId: string,
    private _cost: number,
    private _quantity: number,
    private _createdAt: string
  ) {}

  get id(): string {
    return this._id
  }
  get productId(): string {
    return this._productId
  }
  get cost(): number {
    return this._cost
  }
  get quantity(): number {
    return this._quantity
  }
  get createdAt(): string {
    return this._createdAt
  }

  /**
   * Esta función resta una cantidad especifica
   * al registro de cache de importación, y devuelve
   * el resto o el faltante, si hay faltante la cantidad
   * se establece en 0, y devuelve la cifra negativa.
   * @param quantity cantidad a restar
   * @returns
   */
  resQuantity(quantity: number): number {
    if (this._quantity < quantity) {
      const result = this._quantity - quantity
      this._quantity = 0
      return result
    }
    this._quantity -= quantity
    return this._quantity
  }

  addQuantity(quantity: number): void {
    this._quantity += quantity
  }

  toObject(): IImportInformation {
    return {
      id: this._id,
      cost: this._cost,
      createdAt: this._createdAt,
      productId: this._productId,
      quantity: this._quantity
    }
  }

  static fromDatabase(importInfo: IImportInformation): ImportInformation {
    return new ImportInformation(
      importInfo.id,
      importInfo.productId,
      importInfo.cost,
      importInfo.quantity,
      importInfo.createdAt
    )
  }

  static new(product: Product, cost: number, quantity: number): ImportInformation {
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    return new ImportInformation(id, product.id, cost, quantity, now)
  }
}
