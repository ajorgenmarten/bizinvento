import SQLite from '@/main/commons/services/db'
import { Injectable } from 'electron-injector'
import BudgetMovement from '../types/classes/budget-movement'
import { RunResult } from 'better-sqlite3'

@Injectable()
export default class BudgetMovementRepository {
  constructor(private readonly SQLite: SQLite) {}

  addBudgetMovement(budgetMovement: BudgetMovement): RunResult {
    return this.SQLite.prepare(
      'INSERT INTO BudgetMovement VALUES (@id, @amount, @type, @description, @createdAt)'
    ).run(budgetMovement.toObject())
  }
}
