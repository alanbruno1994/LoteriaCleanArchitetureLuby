import { Either } from '@shared/either'
import { IUserEntity } from '@root/src/1-domain/entities/userEntity'
import { IError } from '@shared/iError'
import { UserEntityKeys } from '@business/repositories/user/iUserRepository'

export interface IInputFindUserByDto {
  key: UserEntityKeys
  value: number | string
}

export type IOutputFindUserByDto = Either<IError, IUserEntity>
