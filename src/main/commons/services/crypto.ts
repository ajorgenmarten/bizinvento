import { Injectable } from 'electron-injector'
import CryptoJS from 'crypto-js'
import envs from '../../configs/envs'
import bcrypt from 'bcrypt'
import crypto from 'node:crypto'

@Injectable()
export default class CryptoService {
  encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, envs.CIPHER_KEY).toString()
  }

  decrypt(encryptedText: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedText, envs.CIPHER_KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
  }

  hash(text: string): string {
    return bcrypt.hashSync(text, 12)
  }

  compareHash(text: string, hash: string): boolean {
    return bcrypt.compareSync(text, hash)
  }

  random(): string {
    return crypto.randomBytes(3).toString('hex').toUpperCase()
  }
}
