import { Injectable } from 'electron-injector'
import SettingsRepository from '../repositories/settings'
import SetSettingsDto from '../dtos/settings/set-settings.dto'

export type GetSettingsOutput = {
  revenue: number
  theme: string
  isLocked: boolean
}

export type SetSettingsOutput = void

@Injectable()
export default class SettingsService {
  constructor(private readonly SettingsRepository: SettingsRepository) {}

  getSettings(): GetSettingsOutput {
    const settings = this.SettingsRepository.getSettings()
    return {
      revenue: settings.revenue,
      theme: settings.theme,
      isLocked: settings.lockPin ? true : false
    }
  }

  setSettings(data: SetSettingsDto): SetSettingsOutput {
    const settings = this.SettingsRepository.getSettings()
    if (data.lockPin) settings.setPin(data.lockPin)
    if (data.lockPin === null) settings.setPin(null)
    settings.setTheme(data.theme)
    settings.setRevenue(data.revenue)
    this.SettingsRepository.updateSettings(settings)
  }
}
