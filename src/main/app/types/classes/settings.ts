import bcrypt from 'bcrypt'
import { ISettings, ISettingsTheme } from '../interfaces'

export default class Settings implements ISettings {
  constructor(
    private readonly _name: string,
    private _revenue: number,
    private _theme: ISettingsTheme,
    private _lockPin: string | null
  ) {}

  get name(): string {
    return this._name
  }
  get revenue(): number {
    return this._revenue
  }
  get theme(): ISettingsTheme {
    return this._theme
  }
  get lockPin(): string | null {
    return this._lockPin
  }

  setPin(pin: string | null): void {
    if (pin == null) {
      this._lockPin = null
      return
    }
    if (!/^[0-9]*$/.test(pin)) throw new Error('El pin solo debe contener números.')
    if (pin.length != 6) throw new Error('El pin debe tener 6 dígitos.')
    const hash = bcrypt.hashSync(pin, 12)
    this._lockPin = hash
  }

  removePin(pin: string): boolean {
    if (!this._lockPin) return true
    if (!bcrypt.compareSync(pin, this._lockPin)) return false
    this._lockPin = null
    return true
  }

  setTheme(theme: 'dark' | 'light' | 'device'): void {
    this._theme = theme
  }

  setRevenue(value: number): void {
    if (value < 0) throw new Error('El porciento de ganancia no puede ser menor a 0')
    this._revenue = value
  }

  static fromDatabase(settings: ISettings): Settings {
    return new Settings(settings.name, settings.revenue, settings.theme, settings.lockPin)
  }
}
