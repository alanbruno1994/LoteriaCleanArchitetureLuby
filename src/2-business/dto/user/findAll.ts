import { Either } from '@shared/either'
import { IUserEntity } from '@root/src/1-domain/entities/userEntity'
import { IError } from '@shared/iError'

export type IInputFindAllUserDto={
  all: boolean
}

export type IOutputFindAllUserDto = Either<IError, Array<Omit<IUserEntity, 'password'>>>
