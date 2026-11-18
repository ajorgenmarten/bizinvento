import CryptoService from '@/main/commons/services/crypto'
import { ISecureApp } from '../interfaces'

export default class SecureApp implements ISecureApp {
  private CryptoJS = new CryptoService()

  constructor(
    private readonly _name: string,
    private _lastPing: string,
    private _expiration: string,
    private _licenseEncrypted: string | null,
    private _licenseHash: string | null
  ) {}

  get name(): string {
    return this._name
  }
  get lastPing(): string {
    return this._lastPing
  }
  get expiration(): string {
    return this._expiration
  }
  get licenseEncrypted(): string | null {
    return this._licenseEncrypted
  }
  get licenseHash(): string | null {
    return this._licenseHash
  }

  get expirationWarn(): boolean {
    const expiration = new Date(this._expiration).getTime() - 5 * 24 * 60 * 60 * 1000
    return new Date().toISOString() >= new Date(expiration).toISOString()
  }

  active(text: string): boolean {
    if (!this.CryptoJS.compareHash(text.toUpperCase(), this._licenseHash as string)) return false
    this._licenseEncrypted = null
    this._licenseHash = null
    const date = new Date(
      this._expiration > new Date().toISOString() ? this._expiration : new Date().toISOString()
    )
    date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000)
    this._expiration = date.toISOString()
    return true
  }

  get status(): 'active' | 'expired' {
    return this._lastPing >= this._expiration || new Date().toISOString() > this._expiration
      ? 'expired'
      : 'active'
  }

  ping(date: Date): void {
    const isoDate = date.toISOString()
    if (this._lastPing > isoDate) throw new Error(`Inconsistencia de fechas`)
    this._lastPing = isoDate
    if (this._lastPing > this._expiration) {
      const random = this.CryptoJS.random()
      this._licenseEncrypted = this.CryptoJS.encrypt(random)
      this._licenseHash = this.CryptoJS.hash(random)
    }
  }

  toObject(): ISecureApp {
    return {
      name: this._name,
      lastPing: this._lastPing,
      expiration: this._expiration,
      licenseEncrypted: this._licenseEncrypted,
      licenseHash: this._licenseHash
    }
  }

  static fromObject(info: ISecureApp): SecureApp {
    return new SecureApp(
      info.name,
      info.lastPing,
      info.expiration,
      info.licenseEncrypted,
      info.licenseHash
    )
  }

  static new(): SecureApp {
    const cryptojs = new CryptoService()
    const random = cryptojs.random()
    return new SecureApp(
      'application-info',
      new Date().toISOString(),
      new Date().toISOString(),
      cryptojs.encrypt(random),
      cryptojs.hash(random)
    )
  }
}
