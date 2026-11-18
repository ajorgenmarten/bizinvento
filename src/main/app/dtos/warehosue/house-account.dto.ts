import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator'

export default class HouseAccountDto {
  @IsNotEmpty()
  @IsUUID()
  id!: string

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity!: number
}
