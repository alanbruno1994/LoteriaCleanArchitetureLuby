import { IInputDeleteAccessProfileDto } from '@business/dto/access/delete'
import { IsString } from 'class-validator'
import { AbstractSerializer } from '../abstractSerializer'

export class InputDeleteAccessProfile extends AbstractSerializer<IInputDeleteAccessProfileDto> {
  @IsString()
  secure_id!: string
}
