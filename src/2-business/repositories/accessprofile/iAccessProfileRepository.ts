/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { IAccessProfileEntity } from '@domain/entities/accessProfileEntity'
import { IRelation } from '../relation'
import { IWhere } from '../where'
import 'reflect-metadata'
// Isso aqui serve para dizer que tipos de elementos
// serao usado como uma chave para um consulta de dados
// por exemplo
export type AccessProfileEntityKeys = keyof Omit<
IAccessProfileEntity,
'game' |'user' | 'password' | 'created_at' | 'updated_at'
>
export interface IInputUpdateAccess {
  updateWhere: IWhere<AccessProfileEntityKeys, string | number>
  newData: Partial<IAccessProfileEntity>
}
// Isso aqui vai ser usado na interface repository
export interface IInputDeleteAccess{
  key: AccessProfileEntityKeys
  value: string | number
}
// Todos os metodos descritos aqui sao esperados que alguma entidade
// que possua accesso ao banco de dados implemente essa interface
export interface IAccessProfileRepository {
  create: (
    inputAccessProfileEntity: Omit<IAccessProfileEntity, 'id'>,
  ) => Promise<IAccessProfileEntity>
  findBy: (
    type: AccessProfileEntityKeys,
    key: IAccessProfileEntity[AccessProfileEntityKeys],
    relations?: Array<IRelation<string, AccessProfileEntityKeys>>
  ) => Promise<void | IAccessProfileEntity>
  update: (input: IInputUpdateAccess) => Promise<Partial<IAccessProfileEntity> | void>
  findAll: () => Promise<IAccessProfileEntity[] | void>
  delete: (input: IInputDeleteAccess) => Promise<IAccessProfileEntity | void>
}
// Isso aqui vai ser usada para que algem injete dinamente
// uma depencia em tempo de execucao
export const IAccessProfileRepositoryToken = Symbol.for('IAccessProfileRepositoryToken')
