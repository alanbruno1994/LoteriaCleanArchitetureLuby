/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { IRelation } from '../relation'
import { IWhere } from '../where'
import 'reflect-metadata'
import { IBetEntity } from '@domain/entities'
// Isso aqui serve para dizer que tipos de elementos
// serao usado como uma chave para um consulta de dados
// por exemplo
export type BetEntityKeys = keyof Omit<
IBetEntity,
'game' |'user' | 'password' | 'created_at' | 'updated_at'
>

export interface IInputUpdateBet {
  updateWhere: IWhere<BetEntityKeys, string | number>
  newData: Partial<IBetEntity>
}

// Isso aqui vai ser usado na interface repository
export interface IInputDeleteBet {
  key: BetEntityKeys
  value: string | number
}

// Todos os metodos descritos aqui sao esperados que alguma entidade
// que possua accesso ao banco de dados implemente essa interface
export interface IBetRepository {
  create: (
    inputUserEntity: Omit<IBetEntity, 'id' | 'user_id' | 'game_id'>,
    user_id: number,
    game_id: number
  ) => Promise<IBetEntity>
  findBy: (
    type: BetEntityKeys,
    key: IBetEntity[BetEntityKeys],
    relations?: Array<IRelation<string, BetEntityKeys>>
  ) => Promise<void | IBetEntity>
  update: (input: IInputUpdateBet) => Promise<Partial<IBetEntity> | void>
  findAll: () => Promise<IBetEntity[] | void>
  delete: (input: IInputDeleteBet) => Promise<IBetEntity | void>
}
// Isso aqui vai ser usada para que algem injete dinamente
// uma depencia em tempo de execucao
export const IBetRepositoryToken = Symbol.for('IBetRepositoryToken')
