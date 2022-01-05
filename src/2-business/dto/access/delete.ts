import { IAccessProfileEntity } from '@domain/entities/accessProfileEntity'
import { Either } from '@shared/either'
import { IError } from '@shared/iError'

export interface IInputDeleteAccessProfileDto {
  secure_id: string
}

export type IOutputDeleteAccessProfileDto = Either<IError, IAccessProfileEntity>
