import { IBudgetMovement, IBudgetMovementType } from '../interfaces'

export default class BudgetMovement implements IBudgetMovement {
  constructor(
    private readonly _id: string,
    private _amount: number,
    private _type: string,
    private _description: string | null,
    private _createdAt: string
  ) {}

  get id(): string {
    return this._id
  }
  get amount(): number {
    return this._amount
  }
  get type(): IBudgetMovementType {
    return this._type as IBudgetMovementType
  }
  get description(): string | null {
    return this._description
  }
  get createdAt(): string {
    return this._createdAt
  }

  toObject(): IBudgetMovement {
    return {
      id: this._id,
      amount: this._amount,
      type: this.type,
      description: this._description,
      createdAt: this._createdAt
    }
  }

  static new(type: IBudgetMovementType, amount: number, description?: string): BudgetMovement {
    const id = crypto.randomUUID()
    const date = new Date().toISOString()
    return new BudgetMovement(id, amount, type, description || null, date)
  }

  static fromDatabase(object: IBudgetMovement): BudgetMovement {
    return new BudgetMovement(
      object.id,
      object.amount,
      object.type,
      object.description,
      object.createdAt
    )
  }
}
