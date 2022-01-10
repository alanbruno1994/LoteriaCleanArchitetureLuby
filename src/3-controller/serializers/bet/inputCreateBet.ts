import { IsString, MinLength, IsNumber, Min } from 'class-validator'
import { AbstractSerializer } from '../abstractSerializer'

export interface IInputCreateBet {
  game_id: number
  price_game: number
  number_choose: string
}

export class InputCreateBet extends AbstractSerializer<IInputCreateBet> {
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
