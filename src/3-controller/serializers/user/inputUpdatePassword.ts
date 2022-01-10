import { IsString, MinLength } from 'class-validator'
import { AbstractSerializer } from '../abstractSerializer'

export interface IUpdatePassword {
  password: string
  tokenRecover: string
}

export class InputUpdatePassword extends AbstractSerializer<IUpdatePassword> {
  @MinLength(8)
  @IsString()
  password: string

  @IsString()
  @MinLength(8)
  tokenRecover: string
}
