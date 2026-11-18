import { IsNotEmpty, IsString, Length } from 'class-validator'

export default class ActiveDto {
  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  key!: string
}
