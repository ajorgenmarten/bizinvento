import { Injectable } from 'electron-injector'
import AddProductDto from '../dtos/warehosue/add-product.dto'
import { IProduct } from '../types/interfaces'
import WarehouseRepository from '../repositories/warehouse'
import Product from '../types/classes/product'
import Order from '../types/classes/order'
import FilterProductsDto from '../dtos/warehosue/filter-products.dto'
import ImportInformation from '../types/classes/import-information'
import AddMoreDto from '../dtos/warehosue/add-more.dto'
import EditProductDto from '../dtos/warehosue/edit-product.dto'
import DeleteProductDto from '../dtos/warehosue/delete-product.dto'
import HouseAccountDto from '../dtos/warehosue/house-account.dto'
import PosService from './pos.service'

export type GetStatsOutput = {
  products: number
  itemsInStock: number
  totalSales: number
  inventoryCosts: number
}

@Injectable()
export default class WarehouseService {
  constructor(
    private readonly WarehouseRepository: WarehouseRepository,
    private readonly PosService: PosService
  ) {}

  /**
   * Esta función agrega un nuevo producto, o si ya este se
   * encuentra modifica su cantidad y su precio de venta.
   * @param data Datos del producto a agregar o modificar
   * @returns
   */
  addProduct(data: AddProductDto): IProduct {
    const existingProduct = this.WarehouseRepository.findProductByName(data.name)

    if (!existingProduct) {
      const newProduct = Product.new(data.name, data.quantity, data.price)
      const order = Order.new('import')
      order.addMovement(newProduct, data.importCost, data.quantity)
      this.WarehouseRepository.addProductTransaction(newProduct, order)
      this.registerImportInformation(newProduct, data.importCost, data.quantity)
      return newProduct.toObject()
    }

    existingProduct.addQuantity(data.quantity)
    existingProduct.updatePrice(data.price)
    const order = Order.new('import')
    order.addMovement(existingProduct, data.importCost, data.quantity)
    this.WarehouseRepository.updateProductTransaction(existingProduct, order)
    this.registerImportInformation(existingProduct, data.importCost, data.quantity)

    return existingProduct.toObject()
  }

  deleteProduct(data: DeleteProductDto): void {
    const product = this.WarehouseRepository.findProductById(data.id)
    if (!product) throw new Error('El producto no se encuentra registrado')

    const involvedMovements = this.WarehouseRepository.getInvolvedMovementsOfProduct(product.id)
    const relatedOrdersToMovements =
      this.WarehouseRepository.getRelatedOrdersToMovements(involvedMovements)

    const idsOfOrdersToDelete: string[] = []
    const ordersToUpdate: Order[] = []

    for (const involvedMovement of involvedMovements) {
      const order = relatedOrdersToMovements.find((ro) => ro.id == involvedMovement.orderId)
      if (!order) continue
      order.restToTotalPrice(involvedMovement.currentPrice * involvedMovement.quantity)
      if (order.totalPrice <= 0) idsOfOrdersToDelete.push(order.id)
      else ordersToUpdate.push(order)
    }

    this.WarehouseRepository.deleteProductTransaction(
      involvedMovements,
      idsOfOrdersToDelete,
      ordersToUpdate,
      product.id
    )
  }

  filterProducts(data: FilterProductsDto): {
    totalItems: number
    totalPages: number
    page: number
    result: IProduct[]
  } {
    return this.WarehouseRepository.filterProducts(data)
  }

  editProduct(data: EditProductDto): void {
    const product = this.WarehouseRepository.findProductById(data.id)

    if (!product) throw new Error('Este producto no se encuentra registrado')

    product.setName(data.name)
    product.updatePrice(data.price)

    this.WarehouseRepository.updateProduct(product)
  }

  getStats(): GetStatsOutput {
    const products = this.WarehouseRepository.countProducts()
    const itemsInStock = this.WarehouseRepository.countItemsInStock()
    const totalSales = this.WarehouseRepository.getSalesValueInStock()
    const inventoryCosts = this.WarehouseRepository.getInventoryCosts()
    return { products, itemsInStock, totalSales, inventoryCosts }
  }

  addMore(data: AddMoreDto): void {
    const product = this.WarehouseRepository.findProductById(data.id)

    if (!product) throw new Error('El producto no se encuentra registrado en la base de datos')

    product.addQuantity(data.quantity)
    product.updatePrice(data.price)
    const order = Order.new('import')
    order.addMovement(product, data.importCost, data.quantity)

    this.WarehouseRepository.updateProductTransaction(product, order)
    this.registerImportInformation(product, data.importCost, data.quantity)
  }

  houseAccount(data: HouseAccountDto): void {
    const product = this.WarehouseRepository.findProductById(data.id)

    if (!product) throw new Error('El producto no se encuentra registrado en la base de datos')
    const importInformation = this.WarehouseRepository.getLastImportInfo(data.id)

    if (!importInformation)
      throw new Error(`No hay registros de información de importación de este producto`)

    product.restQuantity(data.quantity)
    const order = Order.new('house')
    order.addMovement(product, product.price, data.quantity)

    this.WarehouseRepository.updateProductTransaction(product, order)
    this.PosService.registerImportInformation(product, data.quantity)
  }

  private registerImportInformation(product: Product, cost: number, quantity: number): void {
    const lastInfo = this.WarehouseRepository.getLastImportInfo(product.id)

    if (!lastInfo || lastInfo.cost != cost) {
      const importInformation = ImportInformation.new(product, cost, quantity)
      this.WarehouseRepository.addImportInformation(importInformation)
      return
    }

    const importInformation = ImportInformation.fromDatabase(lastInfo)
    importInformation.addQuantity(quantity)
    this.WarehouseRepository.updateImportInformation(importInformation)
  }
}
