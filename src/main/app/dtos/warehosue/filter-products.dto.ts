import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator'

export default class FilterProductsDto {
  @IsOptional()
  @IsString()
  search?: string
  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(1)
  page?: number
}
