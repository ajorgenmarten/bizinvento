import { Injectable } from 'electron-injector'
import Order from '../types/classes/order'
import BudgetMovement from '../types/classes/budget-movement'
import BudgetMovementRepository from '../repositories/budget-movement'

@Injectable()
export default class BudgetMovementService {
  constructor(private readonly BudgetMovementRepository: BudgetMovementRepository) {}
  registerPOSSale(order: Order): void {
    const budgetMovement = BudgetMovement.new('in', order.totalPrice, 'Punto de venta')
    this.BudgetMovementRepository.addBudgetMovement(budgetMovement)
  }
}
