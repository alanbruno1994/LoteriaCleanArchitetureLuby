import { IsEmail, IsString } from 'class-validator'
import { AbstractSerializer } from '../abstractSerializer'

export interface IRecoverPassword {
  userEmail: string
  redirectUrl: string
}

export class InputRecoverPassword extends AbstractSerializer<IRecoverPassword> {
  @IsEmail()
  userEmail: string

  @IsString()
  redirectUrl: string
}
