import { IGameEntity, InputGameEntity } from '@domain/entities/gameEntity'
import { Either } from '@shared/either'
import { IError } from '@shared/iError'

export interface IInputCreateGameDto extends InputGameEntity {
}

export type IOutputCreateGameDto = Either<IError, IGameEntity>
