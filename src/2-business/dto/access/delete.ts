import { IAccessProfileEntity } from '@domain/entities/accessProfileEntity'
import { Either } from '@shared/either'
import { IError } from '@shared/iError'

export interface IInputDeleteAccessProfileDto {
  secureId: string
}

export type IOutputDeleteAccessProfileDto = Either<IError, IAccessProfileEntity>
