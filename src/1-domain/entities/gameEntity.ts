/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { AbstractEntity } from '@domain/abstractEntity'
import { ITimestamps } from '@domain/timestamps'
import { right, Right } from '@shared/either'
import { IBetEntity } from './betEntity'
import { IUserEntity } from './userEntity'

export interface IGameEntityRelations { // Aqui serve para definir as relacoes da entidade
  bets: IBetEntity[]
  users: IUserEntity[]
}

export interface IGameEntity extends ITimestamps, Partial<IGameEntityRelations>{
  id: number
  secure_id: string
  type: string
  range: number
  price: number
  max_number: number
  color: string
}

// O Pick constrói um tipo escolhendo o conjunto de propriedades
export type InputGameEntity = Pick<
IGameEntity,
'type' | 'range' | 'price' | 'max_number' | 'color'
>

// Isso aqui vai ser usado para montar os dados
export class GameEntity extends AbstractEntity<IGameEntity> {
  static create (props: InputGameEntity): Right<void, GameEntity> {
    const currentDate = new Date()// pega a data atual

    const game = new GameEntity({
      ...props,
      id: 0,
      secure_id: '',
      created_at: currentDate,
      updated_at: currentDate
    })
    // Aqui envia um sucesso ou seja uma instancia Right
    return right(game)
  }

  static update (props: Partial<IGameEntity>): Right<void, GameEntity> {
    const currentDate = new Date()// pega a data atual

    const game = new GameEntity({
      ...props,
      updated_at: currentDate
    } as IGameEntity)
    // Aqui envia um sucesso ou seja uma instancia Right
    return right(game)
  }
}
