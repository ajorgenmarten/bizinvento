import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator'

export default class GetOrdersDto {
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  page?: number

  @IsOptional()
  @IsString()
  search?: string
}
