import { IsNotEmpty, IsString, IsUUID } from 'class-validator'

export default class GetMovementsOfOrderDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  orderId!: string
}
