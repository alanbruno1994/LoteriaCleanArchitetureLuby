import { Either } from '@shared/either'
import { IError } from '@shared/iError'

export interface IInputVerifyAuthenticateUseCase {
  token: string
}

export type IOutputVerifyAuthenticateUseCase = Either<
IError,
{
  verify: boolean
  user_secure_id: string
  user_id: number
}
>
