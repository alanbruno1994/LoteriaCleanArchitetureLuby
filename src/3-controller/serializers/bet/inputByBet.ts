import { IsString } from 'class-validator'
import { AbstractSerializer } from '../abstractSerializer'

export interface IInputByBet {
  secure_id: string
}

export class InputByBet extends AbstractSerializer<IInputByBet> {
  @IsString()
  secure_id!: string
}
