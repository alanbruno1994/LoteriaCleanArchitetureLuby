import { IUserEntity } from '@domain/entities/userEntity'
import { Either } from '@shared/either'
import { IError } from '@shared/iError'

export interface IInputDeleteUserDto {
  secure_id: string
}

export type IOutputDeleteUserDto = Either<IError, IUserEntity>
