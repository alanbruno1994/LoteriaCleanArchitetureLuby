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
  id: number | undefined
  secureId: string | undefined
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

// Isso aqui vai ser usado para montar os dados
export class GameEntity extends AbstractEntity<IGameEntity> {
  static create (props: InputGameEntity): Right<void, GameEntity> {
    const currentDate = new Date()// pega a data atual

    const game = new GameEntity({
      ...props,
      id: undefined,
      secureId: undefined,
      created_at: currentDate,
      updated_at: currentDate
    })
    // Aqui envia um sucesso ou seja uma instancia Right
    return right(game)
  }

  static update (props: Partial<IUserEntity>): Right<void, GameEntity> {
    const currentDate = new Date()// pega a data atual

    const game = new GameEntity({
      ...props,
      updated_at: currentDate
    } as IGameEntity)
    // Aqui envia um sucesso ou seja uma instancia Right
    return right(game)
  }
}
