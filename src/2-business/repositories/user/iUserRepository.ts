/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { IUserEntity } from '@domain/entities/userEntity'
import { IRelation } from '../relation'
import { IWhere } from '../where'
// Isso aqui serve para dizer que tipos de elementos
// serao usado como uma chave para um consulta de dados
// por exemplo
export type UserEntityKeys = keyof Omit<
IUserEntity,
'access' | 'password' | 'created_at' | 'updated_at'
>

export interface IInputUpdateUser {
  updateWhere: IWhere<UserEntityKeys, string | number>
  newData: Partial<IUserEntity>
}

export interface IInputDeleteUser {
  key: UserEntityKeys
  value: string | number
}
export interface IUserRepository {
  create: (
    inputUserEntity: Omit<IUserEntity, 'id' | 'accessProfileId'>,
    accessProfileId: number
  ) => Promise<IUserEntity>
  findBy: (
    type: UserEntityKeys,
    key: IUserEntity[UserEntityKeys],
    relations?: Array<IRelation<string, UserEntityKeys>>
  ) => Promise<void | IUserEntity>
  update: (input: IInputUpdateUser) => Promise<Partial<IUserEntity> | void>
  findAll: () => Promise<IUserEntity[] | void>
  delete: (input: IInputDeleteUser) => Promise<IUserEntity | void>
}