import { Controller, OnInvoke, Payload } from 'electron-injector'
import SettingsService, {
  type SetSettingsOutput,
  type GetSettingsOutput
} from '../services/settings.service'
import SetSettingsDto from '../dtos/settings/set-settings.dto'

@Controller('settings')
export default class SettingsController {
  constructor(private readonly SettingsService: SettingsService) {}

  @OnInvoke('set-settings')
  setSettings(@Payload() payload: SetSettingsDto): SetSettingsOutput {
    return this.SettingsService.setSettings(payload)
  }

  @OnInvoke('get-settings')
  getSettings(): GetSettingsOutput {
    return this.SettingsService.getSettings()
  }

  @OnInvoke('check-pin')
  checkPin() {}
}
