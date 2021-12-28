import { IBetEntity } from '@domain/entities/betEntity'
import { Either } from '@shared/either'
import { IError } from '@shared/iError'

export interface IInputDeleteBetDto {
  secureId: string
}

export type IOutputDeleteBetDto = Either<IError, IBetEntity>
