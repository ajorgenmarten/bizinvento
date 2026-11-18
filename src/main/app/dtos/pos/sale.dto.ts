import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
  ValidateNested
} from 'class-validator'
import { Type } from 'class-transformer'
import { type IOrderPaymentType } from '../../types/interfaces'

class CartItem {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id!: string
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @Min(1)
  count!: number
}

export default class PosDto {
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CartItem)
  items!: CartItem[]
  @IsNotEmpty()
  @IsString()
  @IsIn(['cash', 'card'])
  paymentType!: IOrderPaymentType
}
