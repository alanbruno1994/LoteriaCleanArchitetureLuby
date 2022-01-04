import { InputUpdateBetDto } from '@business/dto/bet/update'
import { IsString, MinLength, IsNumber, IsOptional, Min } from 'class-validator'
import { AbstractSerializer } from '../abstractSerializer'

export class InputUpdateBet extends AbstractSerializer<InputUpdateBetDto> {
  @IsNumber()
  @IsOptional()
  @Min(1)
  userId?: number

  @IsNumber()
  @IsOptional()
  @Min(1)
  gameId?: number

  @IsNumber()
  @IsOptional()
  @Min(0)
  priceGame?: number

  @IsString()
  @MinLength(1)
  @IsOptional()
  numbeChoose?: string
}
