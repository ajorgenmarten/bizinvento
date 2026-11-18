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
