import { IGameEntity } from '@domain/entities/gameEntity'
import { Either } from '@shared/either'
import { IError } from '@shared/iError'

export type InputUpdateGameDto = Partial<IGameEntity>

export type IOutputUpdateGameDto = Either<IError, IGameEntity>
