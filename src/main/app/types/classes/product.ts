import { IProduct } from '../interfaces'
import { generateSlug } from '@/main/commons/helpers'

export default class Product implements IProduct {
  constructor(
    private readonly _id: string,
    private _name: string,
    private _slug: string,
    private _quantity: number,
    private _price: number,
    private _createdAt: string,
    private _updatedAt: string
  ) {}

  get id(): string {
    return this._id
  }
  get name(): string {
    return this._name
  }
  get slug(): string {
    return this._slug
  }
  get quantity(): number {
    return this._quantity
  }
  get price(): number {
    return this._price
  }
  get createdAt(): string {
    return this._createdAt
  }
  get updatedAt(): string {
    return this._updatedAt
  }

  setName(name: string): void {
    this._name = name.trim()
    this._slug = generateSlug(this._name)
    this._updatedAt = new Date().toISOString()
  }

  addQuantity(quantity: number): void {
    this._quantity += quantity
    this._updatedAt = new Date().toISOString()
  }

  restQuantity(quantity: number): void {
    if (this._quantity < quantity)
      throw new Error('No se dispone de la cantidad necesaria de ' + this._name)
    this._quantity -= quantity
    this._updatedAt = new Date().toISOString()
  }

  updatePrice(price: number): void {
    this._price = price
    this._updatedAt = new Date().toISOString()
  }

  toObject(): IProduct {
    return {
      id: this._id,
      name: this._name,
      slug: this._slug,
      quantity: this._quantity,
      price: this._price,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    }
  }

  static fromDatabase(product: IProduct): Product {
    return new Product(
      product.id,
      product.name,
      product.slug,
      product.quantity,
      product.price,
      product.createdAt,
      product.updatedAt
    )
  }

  static new(name: string, quantity: number, price: number): Product {
    const id = crypto.randomUUID()
    const slug = generateSlug(name)
    const now = new Date().toISOString()
    return new Product(id, name, slug, quantity, price, now, now)
  }
}
