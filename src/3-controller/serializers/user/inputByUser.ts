import { IsString } from 'class-validator'
import { AbstractSerializer } from '../abstractSerializer'

export interface IInputByUser {
  secure_id: string
}

export class InputByUser extends AbstractSerializer<IInputByUser> {
  @IsString()
  secure_id!: string
}
