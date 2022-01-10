import { Either } from '@shared/either'
import { IError } from '@shared/iError'

export interface IInputRecoverPasswordDto{
  email: string
}

export type IOutputRecoverDto = Either<IError, void>
