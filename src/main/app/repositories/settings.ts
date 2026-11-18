import SQLite from '@/main/commons/services/db'
import { Injectable } from 'electron-injector'
import Settings from '../types/classes/settings'
import { ISettings } from '../types/interfaces'

@Injectable()
export default class SettingsRepository {
  constructor(private readonly SQLite: SQLite) {}

  getSettings(): Settings {
    const settings = this.SQLite.prepare(
      `SELECT * FROM Settings WHERE name = 'system-settings'`
    ).get() as ISettings
    return Settings.fromDatabase(settings)
  }

  updateSettings(settings: Settings): void {
    this.SQLite.prepare(
      `UPDATE Settings SET revenue = ?, theme = ?, lockPin = ? WHERE name = 'system-settings'`
    ).run(settings.revenue, settings.theme, settings.lockPin)
  }
}
