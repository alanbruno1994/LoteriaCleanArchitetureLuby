import { Either } from '@shared/either'
import { IError } from '@shared/iError'
import { IAccessProfileEntity } from '@domain/entities/accessProfileEntity'
import { AccessProfileEntityKeys } from '@business/repositories/accessprofile/iAccessProfileRepository'

export interface IInputFindAccessProfileByDto {
  key: AccessProfileEntityKeys
  value: number | string
}

export type IOutputFindAccessProfileByDto = Either<IError, IAccessProfileEntity>
