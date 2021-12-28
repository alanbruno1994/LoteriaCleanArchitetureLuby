import { IBetEntity } from '@domain/entities/betEntity'
import { Either } from '@shared/either'
import { IError } from '@shared/iError'

export type IOutputFindAllBetDto = Either<IError, IBetEntity[]>
