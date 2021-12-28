import { IAccessProfileEntity } from '@domain/entities/accessProfileEntity'
import { Either } from '@shared/either'
import { IError } from '@shared/iError'

export type InputUpdateAccessProfileDto = Partial<IAccessProfileEntity>

export type IOutputUpdateAccessProfileDto = Either<IError, IAccessProfileEntity>
