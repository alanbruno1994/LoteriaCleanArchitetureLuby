import { InputUpdateGameDto } from '@business/dto/game/update'
import { IsString, MinLength, IsNumber, IsOptional } from 'class-validator'
import { AbstractSerializer } from '../abstractSerializer'

export class InputUpdateGame extends AbstractSerializer<InputUpdateGameDto> {
  @IsString()
  @MinLength(3)
  @IsOptional()
  type?: string

  @IsNumber()
  @IsOptional()
  range?: number

  @IsNumber()
  @IsOptional()
  price?: number

  @IsNumber()
  @IsOptional()
  maxNumber?: number

  @IsString()
  @MinLength(3)
  @IsOptional()
  color?: string
}
