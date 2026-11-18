import { Controller, OnInvoke, OnSend, Payload } from 'electron-injector'
import SecureService from '../services/secure.service'
import ActiveDto from '../dtos/secure/active'
import { app } from 'electron'

@Controller('secure')
export default class SecureController {
  constructor(private readonly SecureService: SecureService) {}

  @OnInvoke('ping')
  ping(): 'expired' | 'active' {
    return this.SecureService.ping()
  }

  @OnInvoke('active')
  active(@Payload() activeDto: ActiveDto): boolean {
    return this.SecureService.active(activeDto.key)
  }

  @OnInvoke('status')
  status(): 'active' | 'expired' {
    return this.SecureService.status()
  }

  @OnInvoke('get-qr-payload')
  getPayload(): string {
    return this.SecureService.getQrPayload()
  }

  @OnInvoke('getKey')
  getKey(): string {
    return this.SecureService.getKey()
  }

  @OnInvoke('expiration-warning')
  expirationWarning(): boolean {
    return this.SecureService.expirationWarning()
  }

  @OnSend('app-exit')
  appExit(): void {
    app.quit()
  }
}
