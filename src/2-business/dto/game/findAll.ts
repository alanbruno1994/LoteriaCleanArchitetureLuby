import { IGameEntity } from '@domain/entities/gameEntity'
import { Either } from '@shared/either'
import { IError } from '@shared/iError'

export type IOutputFindAllGameDto = Either<IError, IGameEntity[]>
