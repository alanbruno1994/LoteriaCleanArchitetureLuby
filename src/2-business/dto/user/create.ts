import {
  InputUserEntity,
  IUserEntity
} from '@root/src/1-domain/entities/userEntity'
import { Either } from '@shared/either'
import { IError } from '@shared/iError'

export interface IInputCreateUserDto extends InputUserEntity {
  access_profile_id: number
}

export type IOutputCreateUserDto = Either<IError, IUserEntity>
