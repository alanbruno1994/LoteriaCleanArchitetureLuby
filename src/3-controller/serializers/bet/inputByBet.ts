import { IsString } from 'class-validator'
import { AbstractSerializer } from '../abstractSerializer'

export interface IInputByBet {
  secureId: string
}

export class InputByBet extends AbstractSerializer<IInputByBet> {
  @IsString()
  secureId!: string
}
