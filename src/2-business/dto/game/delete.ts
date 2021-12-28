import { IGameEntity } from '@domain/entities/gameEntity'
import { Either } from '@shared/either'
import { IError } from '@shared/iError'

export interface IInputDeleteGameDto {
  secureId: string
}

export type IOutputDeleteGameDto = Either<IError, IGameEntity>
