import { Injectable } from 'electron-injector'
import SaleDto from '../dtos/pos/sale.dto'
import PosRepository from '../repositories/pos'
import Order from '../types/classes/order'
import Product from '../types/classes/product'
import ImportInformation from '../types/classes/import-information'
import { IImportInformation } from '../types/interfaces'

@Injectable()
export default class PosService {
  constructor(private readonly PosRepository: PosRepository) {}

  sale(data: SaleDto): boolean {
    const products = this.PosRepository.getProducts(data.items.map((i) => i.id))

    if (products.length != data.items.length)
      throw new Error('No se encontraron todos los productos que se solicitan en la base de datos')

    const order = Order.new('export', data.paymentType)

    for (const item of data.items) {
      const product = products.find((p) => p.id == item.id) as Product
      order.addMovement(product, product.price, item.count)
      product.restQuantity(item.count)
    }

    this.PosRepository.saleTransaction(products, order)

    for (const item of data.items) {
      const product = products.find((p) => p.id == item.id) as Product
      this.registerImportInformation(product, item.count)
    }

    return true
  }

  registerImportInformation(product: Product, quantity: number): void {
    const importInformationOfProduct = this.PosRepository.getImportInformation(
      product
    ) as ImportInformation[]

    let leftToRest = quantity
    const registersToDelete: IImportInformation[] = []
    const registersToUpdate: IImportInformation[] = []

    if (!importInformationOfProduct.length)
      throw new Error('No hay registros de caché de que este producto se hubiese importado')

    let currentInformation = importInformationOfProduct.shift()

    while (currentInformation) {
      const currentQuantity = currentInformation.resQuantity(leftToRest)
      if (currentQuantity <= 0) {
        leftToRest = currentQuantity * -1
        registersToDelete.push(currentInformation.toObject())
      } else registersToUpdate.push(currentInformation.toObject())

      if (leftToRest > 0) currentInformation = importInformationOfProduct.shift()
    }

    for (const importInformation of registersToDelete)
      this.PosRepository.deleteImportInformation(importInformation)

    for (const importInformation of registersToUpdate)
      this.PosRepository.updateImportInformation(importInformation)
  }
}
