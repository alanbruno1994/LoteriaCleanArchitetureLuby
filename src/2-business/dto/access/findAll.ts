import { Either } from '@shared/either'
import { IError } from '@shared/iError'
import { IAccessProfileEntity } from '@domain/entities/accessProfileEntity'

export type IInputFindAllAccessProfileDto={
  all: boolean
}

export type IOutputFindAllAccessProfileDto = Either<IError, IAccessProfileEntity[]>
