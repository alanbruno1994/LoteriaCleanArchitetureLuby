import { IsString } from 'class-validator'
import { AbstractSerializer } from '../abstractSerializer'

export interface IInputByGame {
  secureId: string
}

export class InputByGame extends AbstractSerializer<IInputByGame> {
  @IsString()
  secureId!: string
}
