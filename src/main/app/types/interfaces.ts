export interface ISecureApp {
  name: string
  expiration: string
  lastPing: string
  licenseEncrypted: string | null
  licenseHash: string | null
}

export interface IProduct {
  id: string
  name: string
  slug: string
  quantity: number
  price: number
  createdAt: string
  updatedAt: string
}

export interface IMovement {
  id: string
  productId: string
  currentPrice: number
  quantity: number
  orderId: string
}

export type IOrderPaymentType = 'cash' | 'card'

export interface IOrder {
  id: string
  totalPrice: number
  type: 'import' | 'export' | 'house' | 'trash'
  paymentType: IOrderPaymentType
  createdAt: string
}

export interface IImportInformation {
  id: string
  productId: string
  cost: number
  quantity: number
  createdAt: string
}

export type ISettingsTheme = 'dark' | 'light' | 'device'

export interface ISettings {
  name: string
  revenue: number
  theme: ISettingsTheme
  lockPin: string | null
}

export type IBudgetMovementType = 'in' | 'out'

export interface IBudgetMovement {
  id: string
  amount: number
  type: IBudgetMovementType
  description: string | null
  createdAt: string
}
