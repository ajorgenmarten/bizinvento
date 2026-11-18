import { IMovement } from '../interfaces'

export default class Movement implements IMovement {
  constructor(
    private readonly _id: string,
    private readonly _productId: string,
    private readonly _currentPrice: number,
    private readonly _quantity: number,
    private readonly _orderId: string
  ) {}

  get id(): string {
    return this._id
  }
  get productId(): string {
    return this._productId
  }
  get currentPrice(): number {
    return this._currentPrice
  }
  get quantity(): number {
    return this._quantity
  }
  get orderId(): string {
    return this._orderId
  }

  toObject(): IMovement {
    return {
      id: this._id,
      currentPrice: this._currentPrice,
      orderId: this._orderId,
      productId: this._productId,
      quantity: this._quantity
    }
  }

  static fromDatabase(movement: IMovement): Movement {
    return new Movement(
      movement.id,
      movement.productId,
      movement.currentPrice,
      movement.quantity,
      movement.orderId
    )
  }

  static new(productId: string, orderId: string, currentPrice: number, quantity: number): Movement {
    const id = crypto.randomUUID()
    return new Movement(id, productId, currentPrice, quantity, orderId)
  }
}
