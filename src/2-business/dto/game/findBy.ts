import { Either } from '@shared/either'
import { IError } from '@shared/iError'
import { IGameEntity } from '@domain/entities/gameEntity'
import { GameEntityKeys } from '@business/repositories/game/iGameRepository'

export interface IInputFindGameByDto {
  key: GameEntityKeys
  value: number | string
}

export type IOutputFindGameByDto = Either<IError, IGameEntity>
