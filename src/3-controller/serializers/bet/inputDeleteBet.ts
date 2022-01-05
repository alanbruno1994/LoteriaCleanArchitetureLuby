import { IInputDeleteBetDto } from '@business/dto/bet/delete'
import { IsString } from 'class-validator'
import { AbstractSerializer } from '../abstractSerializer'

export class InputDeleteBet extends AbstractSerializer<IInputDeleteBetDto> {
  @IsString()
  secure_id!: string
}
