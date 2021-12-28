import { Either } from '@shared/either'
import { IUserEntity } from '@root/src/1-domain/entities/userEntity'
import { IError } from '@shared/iError'

export type IOutputFindAllUserDto = Either<IError, IUserEntity[]>
