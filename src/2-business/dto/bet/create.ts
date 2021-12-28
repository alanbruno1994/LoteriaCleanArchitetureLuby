import { IBetEntity, InputBetEntity } from '@domain/entities/betEntity'
import { Either } from '@shared/either'
import { IError } from '@shared/iError'

export interface IInputCreateBetDto extends InputBetEntity {
  gameId: number
  userId: number
}

export type IOutputCreateBetDto = Either<IError, IBetEntity>
