import { InputUpdateGameDto } from '@business/dto/game/update'
import { IsString, MinLength, IsNumber, IsOptional, Min } from 'class-validator'
import { AbstractSerializer } from '../abstractSerializer'

export class InputUpdateGame extends AbstractSerializer<InputUpdateGameDto> {
  @IsString()
  @MinLength(3)
  @IsOptional()
  type?: string

  @IsNumber()
  @IsOptional()
  @Min(1)
  range?: number

  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number

  @IsNumber()
  @IsOptional()
  @Min(1)
  maxNumber?: number

  @IsString()
  @MinLength(3)
  @IsOptional()
  color?: string
}
