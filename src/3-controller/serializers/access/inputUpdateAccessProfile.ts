import { InputUpdateAccessProfileDto } from '@business/dto/access/update'
import { IsString, MinLength, IsOptional } from 'class-validator'
import { AbstractSerializer } from '../abstractSerializer'

export class InputUpdateAccessProfile extends AbstractSerializer<InputUpdateAccessProfileDto> {
  @IsString()
  @MinLength(3)
  @IsOptional()
  level?: string
}
