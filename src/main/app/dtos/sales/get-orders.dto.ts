import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator'

export default class GetOrdersDto {
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  page?: number
}
