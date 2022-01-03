import { IsString } from 'class-validator'
import { AbstractSerializer } from '../abstractSerializer'

export interface IInputByUser {
  secureId: string
}

export class InputByUser extends AbstractSerializer<IInputByUser> {
  @IsString()
  secureId!: string
}
