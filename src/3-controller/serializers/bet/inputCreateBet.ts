import { IInputCreateBetDto } from '@business/dto/bet/create'
import { IsString, MinLength, IsNumber, Min } from 'class-validator'
import { AbstractSerializer } from '../abstractSerializer'

export class InputCreateBet extends AbstractSerializer<IInputCreateBetDto> {
  @IsNumber()
  @Min(1)
  userId!: number

  @IsNumber()
  @Min(1)
  gameId!: number

  @IsNumber()
  @Min(0)
  priceGame!: number

  @IsString()
  @MinLength(1)
  numbeChoose!: string
}
