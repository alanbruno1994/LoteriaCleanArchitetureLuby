/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { IGameEntity } from '@domain/entities/gameEntity'
import { IRelation } from '../relation'
import { IWhere } from '../where'
import 'reflect-metadata'
// Isso aqui serve para dizer que tipos de elementos
// serao usado como uma chave para um consulta de dados
// por exemplo
export type GameEntityKeys = keyof Omit<
IGameEntity,
'bets' |'users' | 'password' | 'created_at' | 'updated_at'
>
export interface IInputUpdateGame {
  updateWhere: IWhere<GameEntityKeys, string | number>
  newData: Partial<IGameEntity>
}
// Isso aqui vai ser usado na interface repository
export interface IInputDeleteGame{
  key: GameEntityKeys
  value: string | number
}

// Todos os metodos descritos aqui sao esperados que alguma entidade
// que possua accesso ao banco de dados implemente essa interface
export interface IGameRepository {
  create: (
    inputUserEntity: Omit<IGameEntity, 'id'>,
  ) => Promise<IGameEntity>
  findBy: (
    type: GameEntityKeys,
    key: IGameEntity[GameEntityKeys],
    relations?: Array<IRelation<string, GameEntityKeys>>
  ) => Promise<void | IGameEntity>
  update: (input: IInputUpdateGame) => Promise<Partial<IGameEntity> | void>
  findAll: () => Promise<IGameEntity[] | void>
  delete: (input: IInputDeleteGame) => Promise<IGameEntity | void>
}
// Isso aqui vai ser usada para que algem injete dinamente
// uma depencia em tempo de execucao
export const IGameRepositoryToken = Symbol.for('IGameRepositoryToken')
