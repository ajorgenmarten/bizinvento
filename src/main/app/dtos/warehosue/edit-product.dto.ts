import { IsNotEmpty, IsNumber, IsString, IsUUID, Min, MinLength } from 'class-validator'

export default class EditProductDto {
  @IsNotEmpty()
  @IsUUID()
  id!: string

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name!: string

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price!: number
}
