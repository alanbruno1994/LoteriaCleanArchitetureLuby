import { IsString } from 'class-validator'
import { AbstractSerializer } from '../abstractSerializer'

export interface IInputByAccessProfile {
  secureId: string
}

export class InputByAccessProfile extends AbstractSerializer<IInputByAccessProfile> {
  @IsString()
  secureId!: string
}
