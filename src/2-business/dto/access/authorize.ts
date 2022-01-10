import { Either } from '@shared/either'
import { IError } from '@shared/iError'

export interface IInputAuthorizeAccessProfileDto {
  id: number
}

export type IOutputAuthorizeAccessProfileDto = Either<IError, void>
