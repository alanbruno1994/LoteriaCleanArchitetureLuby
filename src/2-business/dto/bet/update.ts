import { IBetEntity } from '@domain/entities/betEntity'
import { Either } from '@shared/either'
import { IError } from '@shared/iError'

export type InputUpdateBetDto = Partial<IBetEntity>

export type IOutputUpdateBetDto = Either<IError, IBetEntity>
