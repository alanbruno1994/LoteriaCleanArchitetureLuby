import { Either } from '@shared/either'
import { IError } from '@shared/iError'
import { BetEntityKeys } from '@business/repositories/bet/iBetRepository'
import { IBetEntity } from '@domain/entities/betEntity'

export interface IInputFindBetByDto {
  key: BetEntityKeys
  value: number | string
}

export type IOutputFindBetByDto = Either<IError, IBetEntity>
