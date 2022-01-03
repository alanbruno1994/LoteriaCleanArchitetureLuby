import { InputUpdateBetDto } from '@business/dto/bet/update'
import { IsString, MinLength, IsNumber, IsOptional } from 'class-validator'
import { AbstractSerializer } from '../abstractSerializer'

export class InputUpdateBet extends AbstractSerializer<InputUpdateBetDto> {
  @IsNumber()
  @IsOptional()
  userId?: number

  @IsNumber()
  @IsOptional()
  gameId?: number

  @IsNumber()
  @IsOptional()
  priceGame?: number

  @IsString()
  @MinLength(1)
  @IsOptional()
  numbeChoose?: string
}
