import { IsString } from 'class-validator'
import { AbstractSerializer } from '../abstractSerializer'

export interface IInputByAccessProfile {
  secure_id: string
}

export class InputByAccessProfile extends AbstractSerializer<IInputByAccessProfile> {
  @IsString()
  secure_id!: string
}
