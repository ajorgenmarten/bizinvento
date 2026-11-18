import { IsNotEmpty, IsUUID } from 'class-validator'

export default class DeleteProductDto {
  @IsNotEmpty()
  @IsUUID()
  id!: string
}
