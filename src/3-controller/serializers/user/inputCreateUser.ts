import { IInputCreateUserDto } from '@root/src/2-business/dto/user/create'
import { IsEmail, IsString, MinLength } from 'class-validator'
import { AbstractSerializer } from '../abstractSerializer'

export class InputCreateUser extends AbstractSerializer<Omit<IInputCreateUserDto, 'accessProfileId'>> {
  @IsString()
  @IsEmail()
  email!: string

  @IsString()
  @MinLength(15)
  name!: string

  @IsString()
  @MinLength(8)
  password!: string
}
