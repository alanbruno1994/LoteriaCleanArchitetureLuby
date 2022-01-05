/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { AbstractEntity } from '@domain/abstractEntity'
import { ITimestamps } from '@domain/timestamps'
import { right, Right } from '@shared/either'
import { IGameEntity } from './gameEntity'
import { IUserEntity } from './userEntity'

export interface IBetEntityRelations { // Aqui serve para definir as relacoes da entidade
  game: IGameEntity
  user: Omit<IUserEntity, 'password'>
}

export interface IBetEntity extends ITimestamps, Partial<IBetEntityRelations>{
  id: number
  secure_id: string
  user_id: number
  game_id: number
  price_game: number
  number_choose: string
}

// O Pick constrói um tipo escolhendo o conjunto de propriedades
export type InputBetEntity = Pick<
IBetEntity,
'price_game' | 'number_choose'
>

export class BetEntity extends AbstractEntity<IBetEntity> {
  static create (props: InputBetEntity): Right<void, BetEntity> {
    const currentDate = new Date()// pega a data atual

    const bet = new BetEntity({
      ...props,
      id: 0,
      secure_id: '',
      user_id: 0,
      game_id: 0,
      created_at: currentDate,
      updated_at: currentDate
    })
    // Aqui envia um sucesso ou seja uma instancia Right
    return right(bet)
  }

  static update (props: Partial<IUserEntity>): Right<void, BetEntity> {
    const currentDate = new Date()// pega a data atual

    const bet = new BetEntity({
      ...props,
      updated_at: currentDate
    } as IBetEntity)
    // Aqui envia um sucesso ou seja uma instancia Right
    return right(bet)
  }
}
