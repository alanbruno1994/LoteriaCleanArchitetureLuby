import { IInputDeleteUserDto } from '@business/dto/user/delete'
import { IsString } from 'class-validator'
import { AbstractSerializer } from '../abstractSerializer'

export class InputDeleteUser extends AbstractSerializer<IInputDeleteUserDto> {
  @IsString()
  secure_id!: string
}
