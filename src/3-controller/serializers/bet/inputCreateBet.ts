import { IInputCreateBetDto } from '@business/dto/bet/create'
import { IsString, MinLength, IsNumber, Min } from 'class-validator'
import { AbstractSerializer } from '../abstractSerializer'

export class InputCreateBet extends AbstractSerializer<IInputCreateBetDto> {
  @IsNumber()
  @Min(1)
  user_id!: number

  @IsNumber()
  @Min(1)
  game_id!: number

  @IsNumber()
  @Min(0)
  price_game!: number

  @IsString()
  @MinLength(1)
  number_choose!: string
}
