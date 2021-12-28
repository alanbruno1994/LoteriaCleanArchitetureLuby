import { ITimestamps } from '@domain/timestamps'
import { IBetEntity } from './betEntity'
import { IUserEntity } from './userEntity'

export interface IGameEntityRelations { // Aqui serve para definir as relacoes da entidade
  bets: IBetEntity[]
  users: IUserEntity[]
}

export interface IGameEntity extends ITimestamps, Partial<IGameEntityRelations>{
  id: number
  secureId: string
  type: string
  range: number
  price: number
  maxNumber: number
  color: string
}

// O Pick constrói um tipo escolhendo o conjunto de propriedades
export type InputGameEntity = Pick<
IGameEntity,
'type' | 'range' | 'price' | 'maxNumber' | 'color'
>
