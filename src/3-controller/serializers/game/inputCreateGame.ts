import { IInputCreateGameDto } from '@business/dto/game/create'
import { IsString, MinLength, IsNumber, Min } from 'class-validator'
import { AbstractSerializer } from '../abstractSerializer'

export class InputCreateGame extends AbstractSerializer<IInputCreateGameDto> {
  @IsString()
  @MinLength(3)
  type!: string

  @IsNumber()
  @Min(1)
  range!: number

  @IsNumber()
  @Min(0)
  price!: number

  @IsNumber()

  @Min(1)
  max_number!: number

  @IsString()
  @MinLength(3)
  color!: string
}
