import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator'

export default class AddMoreDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id!: string
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity!: number
  @IsNotEmpty()
  @IsNumber()
  price!: number
  @IsNotEmpty()
  @IsNumber()
  importCost!: number
}
