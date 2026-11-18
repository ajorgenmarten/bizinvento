import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator'

export default class AddProductDto {
  @IsNotEmpty()
  @IsString()
  name!: string
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
