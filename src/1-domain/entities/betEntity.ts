import { ITimestamps } from '@domain/timestamps'
import { IGameEntity } from './gameEntity'
import { IUserEntity } from './userEntity'

export interface IBetEntityRelations { // Aqui serve para definir as relacoes da entidade
  game: IGameEntity
  user: IUserEntity
}

export interface IBetEntity extends ITimestamps, Partial<IBetEntityRelations>{
  id: number
  secureId: string
  userId: number
  gameId: number
  priceGame: number
  numbeChoose: string
}
