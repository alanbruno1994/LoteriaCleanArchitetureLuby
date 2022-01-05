import { InputUpdateBetDto } from '@business/dto/bet/update'
import { IsString, MinLength, IsNumber, IsOptional, Min } from 'class-validator'
import { AbstractSerializer } from '../abstractSerializer'

export class InputUpdateBet extends AbstractSerializer<InputUpdateBetDto> {
  @IsNumber()
  @IsOptional()
  @Min(1)
  user_id?: number

  @IsNumber()
  @IsOptional()
  @Min(1)
  game_id?: number

  @IsNumber()
  @IsOptional()
  @Min(0)
  price_game?: number

  @IsString()
  @MinLength(1)
  @IsOptional()
  number_choose?: string
}
