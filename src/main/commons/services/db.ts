/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import envs from '../../configs/envs'
import Database, { Transaction } from 'better-sqlite3'
import { DEV_LOGGER, Injectable } from 'electron-injector'

const dbScript = `

  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS SecureApp (
    name TEXT NOT NULL UNIQUE,
    expiration TEXT,
    lastPing TEXT,
    licenseEncrypted TEXT,
    licenseHash TEXT
  );

  CREATE TABLE IF NOT EXISTS Product (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    quantity REAL NOT NULL, -- indica cantidad existente del producto
    price REAL NOT NULL, -- indica el valor para venta
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS Settings (
    name TEXT NOT NULL UNIQUE,
    revenue REAL,
    theme TEXT NOT NULL, -- 'dark' | 'light' | 'device'
    lockPin TEXT
  );

  CREATE TABLE IF NOT EXISTS ImportInformation (
    id TEXT PRIMARY KEY,
    productId TEXT NOT NULL,
    cost REAL NOT NULL,
    quantity REAL NOT NULL,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "Order" (
    id TEXT PRIMARY KEY,
    totalPrice REAL NOT NULL, -- costo total de la orden
    type TEXT NOT NULL, -- e.g. 'import', 'sale', 'trash'
    paymentType TEXT NOT NULL, -- e.g 'cash', 'card'
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS Movement (
    id TEXT PRIMARY KEY,
    productId TEXT NOT NULL,
    currentPrice REAL NOT NULL, -- en caso de importacion indica el costo del producto en ese momento, en caso de venta, indica el valor del producto en ese momento
    quantity REAL NOT NULL,
    orderId TEXT NOT NULL,

    FOREIGN KEY (productId) REFERENCES Product(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (orderId) REFERENCES "Order"(id) ON DELETE CASCADE ON UPDATE CASCADE
  );

  CREATE TABLE IF NOT EXISTS BudgetMovement (
    id TEXT PRIMARY KEY,
    amount REAL NOT NULL,
    type TEXT NOT NULL, -- e.g 'in', 'out'
    description TEXT, -- e.g 'Venta', 'Para abastecimiento'
    createdAt TEXT NOT NULL
  );

  INSERT OR IGNORE INTO Settings VALUES ('system-settings', 30, 'device', NULL);
`

@Injectable()
export default class SQLite {
  private _db: Database.Database = new Database(envs.DB_PATH)

  constructor() {
    this._db.pragma('journal_mode=WAL')
    this._db.pragma('foreign_keys=ON')
    this.exec(dbScript)
  }

  prepare(query: string) {
    const statement = this.db.prepare(query)
    function run(...params: any[]): Database.RunResult {
      DEV_LOGGER(statement.source)
      const result = statement.run(...params)
      DEV_LOGGER(result)
      return result
    }
    function get(...params: any[]): unknown {
      DEV_LOGGER(statement.source)
      const result = statement.get(...params)
      DEV_LOGGER(result)
      return result
    }
    function all(...params: any[]): unknown[] {
      DEV_LOGGER(statement.source)
      const result = statement.all(...params)
      DEV_LOGGER(result)
      return result
    }
    return { run, get, all }
  }

  transaction(fn: (...args: any[]) => any): Transaction {
    return this.db.transaction(fn)
  }

  exec(query: string): Database.Database {
    DEV_LOGGER(query)
    return this._db.exec(query)
  }

  get db(): Database.Database {
    return this._db
  }
}
