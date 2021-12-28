import { ITimestamps } from '@domain/timestamps'
import { IUserEntity } from './userEntity'

export interface IAccessProfileEntityRelations { // Aqui serve para definir as relacoes da entidade
  user: IUserEntity
}

export interface IAccessProfileEntity extends ITimestamps, Partial<IAccessProfileEntityRelations>{
  id: number
  secureId: string
  level: string
}

// O Pick constrói um tipo escolhendo o conjunto de propriedades
export type InputAccessProfileEntity = Pick<
IAccessProfileEntity,
'level'
>
