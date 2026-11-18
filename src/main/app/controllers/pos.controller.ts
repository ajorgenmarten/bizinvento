import { Controller, OnInvoke, Payload } from 'electron-injector'
import SaleDto from '../dtos/pos/sale.dto'
import PosService from '../services/pos.service'

@Controller('pos')
export default class PosController {
  constructor(private readonly PosService: PosService) {}

  @OnInvoke('sale')
  sale(@Payload() payload: SaleDto): boolean {
    return this.PosService.sale(payload)
  }
}
