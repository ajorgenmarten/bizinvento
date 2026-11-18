import SQLite from '@/main/commons/services/db'
import { Injectable } from 'electron-injector'
import SecureApp from '../types/classes/secure-app'
import { ISecureApp } from '../types/interfaces'

@Injectable()
export default class SecureAppRepository {
  constructor(private readonly SQLite: SQLite) {}

  getInfo(): SecureApp | null {
    const info = this.SQLite.prepare('SELECT * FROM SecureApp').get()
    if (!info) return null
    return SecureApp.fromObject(info as ISecureApp)
  }

  addInfo(info: SecureApp): void {
    this.SQLite.prepare('INSERT INTO SecureApp VALUES (?, ?, ?, ?, ?)').run(
      info.name,
      info.lastPing,
      info.expiration,
      info.licenseEncrypted,
      info.licenseHash
    )
  }

  updateInfo(info: SecureApp): void {
    this.SQLite.prepare(
      'UPDATE SecureApp SET lastPing = ?, expiration = ?, licenseEncrypted = ?, licenseHash = ? WHERE name = ?'
    ).run(info.lastPing, info.expiration, info.licenseEncrypted, info.licenseHash, info.name)
  }
}
