import { IsString } from 'class-validator'
import { AbstractSerializer } from '../abstractSerializer'

export interface IInputByGame {
  secure_id: string
}

export class InputByGame extends AbstractSerializer<IInputByGame> {
  @IsString()
  secure_id!: string
}
