import { ITimestamps } from '@domain/timestamps'
import { IAccessProfileEntity } from './accessProfileEntity'

export interface IUserEntityRelations { // Aqui serve para definir as relacoes da entidade
  access: IAccessProfileEntity
}

// Esse Partial inda os atributos sao opcionais
export interface IUserEntity extends ITimestamps, Partial<IUserEntityRelations>{
  id: number
  secureId: string
  email: string
  name: string
  password: string
  accessProfileId: number
  tokenRecoverPassword?: string
  tokenRecoverPasswordCreateDate?: Date
}
