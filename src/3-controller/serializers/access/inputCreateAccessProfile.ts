import { IInputCreateAccessProfileDto } from '@business/dto/access/create'
import { IsString, MinLength } from 'class-validator'
import { AbstractSerializer } from '../abstractSerializer'

export class InputCreateAccessProfile extends AbstractSerializer<IInputCreateAccessProfileDto> {
  @IsString()
  @MinLength(3)
  level!: string
}
