
import { IAccessProfileEntity, InputAccessProfileEntity } from '@domain/entities/accessProfileEntity'
import { Either } from '@shared/either'
import { IError } from '@shared/iError'

export interface IInputCreateAccessProfileDto extends InputAccessProfileEntity {

}

export type IOutputCreateAccessProfileDto = Either<IError, IAccessProfileEntity>
