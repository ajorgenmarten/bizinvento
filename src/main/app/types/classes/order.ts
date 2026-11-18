import { IOrder, IOrderPaymentType } from '../interfaces'
import Movement from './movement'
import Product from './product'

export default class Order implements IOrder {
  private _Movements: Movement[] = []

  constructor(
    private readonly _id: string,
    private _totalPrice: number,
    private readonly _type: IOrder['type'],
    private readonly _paymentType: string,
    private readonly _createdAt: string
  ) {}

  get id(): string {
    return this._id
  }
  get totalPrice(): number {
    return this._totalPrice
  }
  get type(): IOrder['type'] {
    return this._type
  }
  get paymentType(): IOrderPaymentType {
    return this._paymentType as IOrderPaymentType
  }
  get createdAt(): string {
    return this._createdAt
  }
  get Movements(): Movement[] {
    return this._Movements
  }

  restToTotalPrice(value: number): void {
    this._totalPrice -= value
  }

  addMovement(product: Product, currentPrice: number, quantity: number): void {
    const movement = Movement.new(product.id, this._id, currentPrice, quantity)
    this._Movements.push(movement)
    this._totalPrice += movement.currentPrice * quantity
  }

  toObject(): IOrder {
    return {
      id: this._id,
      createdAt: this._createdAt,
      totalPrice: this._totalPrice,
      type: this._type,
      paymentType: this._paymentType as IOrderPaymentType
    }
  }

  static fromDatabase(order: IOrder): Order {
    return new Order(order.id, order.totalPrice, order.type, order.paymentType, order.createdAt)
  }

  static new(type: IOrder['type'], paymentType: IOrderPaymentType = 'cash'): Order {
    const orderId = crypto.randomUUID()
    const now = new Date().toISOString()
    return new Order(orderId, 0, type, paymentType, now)
  }
}
