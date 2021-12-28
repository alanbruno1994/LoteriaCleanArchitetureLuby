import { Either } from '@shared/either'
import { IError } from '@shared/iError'
import { IAccessProfileEntity } from '@domain/entities/accessProfileEntity'

export type IOutputFindAllAccessProfileDto = Either<IError, IAccessProfileEntity[]>
