import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'
import { ISettings } from '../../types/interfaces'
import { Transform } from 'class-transformer'

export default class SetSettingsDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(1000)
  revenue!: number
  @IsString()
  @IsOptional()
  @Transform(({ value }) => {
    if (value) return String(value)
    return null
  })
  lockPin!: string | null
  @IsString()
  @IsNotEmpty()
  @IsIn(['dark', 'device', 'light'])
  theme!: ISettings['theme']
}
