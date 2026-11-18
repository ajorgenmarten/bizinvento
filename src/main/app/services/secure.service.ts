import { Injectable } from 'electron-injector'
import SecureAppRepository from '../repositories/secure'
import SecureApp from '../types/classes/secure-app'
import CryptoService from '@/main/commons/services/crypto'

@Injectable()
export default class SecureService {
  constructor(
    private readonly SecureAppRepository: SecureAppRepository,
    private readonly CryptoService: CryptoService
  ) {}

  status(): 'expired' | 'active' {
    let info = this.SecureAppRepository.getInfo()
    if (info) return info.status
    info = SecureApp.new()
    this.SecureAppRepository.addInfo(info)
    return info.status
  }

  ping(): 'expired' | 'active' {
    const info = this.SecureAppRepository.getInfo() as SecureApp
    info.ping(new Date())
    this.SecureAppRepository.updateInfo(info)
    return info.status
  }

  active(text: string): boolean {
    const info = this.SecureAppRepository.getInfo() as SecureApp
    if (!info.active(text)) return false
    this.SecureAppRepository.updateInfo(info)
    return true
  }

  getKey(): string {
    const info = this.SecureAppRepository.getInfo() as SecureApp
    return this.CryptoService.decrypt(info.licenseEncrypted as string)
  }

  getQrPayload(): string {
    const info = this.SecureAppRepository.getInfo() as SecureApp
    return info.licenseEncrypted || ''
  }

  expirationWarning(): boolean {
    const info = this.SecureAppRepository.getInfo() as SecureApp
    return info.status === 'active' && info.expirationWarn
  }
}
