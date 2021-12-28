/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { AbstractEntity } from '@domain/abstractEntity'
import { ITimestamps } from '@domain/timestamps'
import { right, Right } from '@shared/either'
import { IAccessProfileEntity } from './accessProfileEntity'

export interface IUserEntityRelations { // Aqui serve para definir as relacoes da entidade
  access: IAccessProfileEntity
}

// Esse Partial inda os atributos sao opcionais
export interface IUserEntity extends ITimestamps, Partial<IUserEntityRelations>{
  id: number | undefined
  secureId: string | undefined
  email: string
  name: string
  password: string
  accessProfileId: number | undefined
  tokenRecoverPassword?: string
  tokenRecoverPasswordCreateDate?: Date
}
// O Pick constrói um tipo escolhendo o conjunto de propriedades
export type InputUserEntity = Pick<
IUserEntity,
'email' | 'name' | 'password'
>
// Isso aqui vai ser usado para montar os dados
export class UserEntity extends AbstractEntity<IUserEntity> {
  static create (props: InputUserEntity): Right<void, UserEntity> {
    const currentDate = new Date()// pega a data atual

    const user = new UserEntity({
      ...props,
      id: undefined,
      secureId: undefined,
      accessProfileId: undefined,
      created_at: currentDate,
      updated_at: currentDate
    })
    // Aqui envia um sucesso ou seja uma instancia Right
    return right(user)
  }

  static update (props: Partial<IUserEntity>): Right<void, UserEntity> {
    const currentDate = new Date()// pega a data atual

    const user = new UserEntity({
      ...props,
      updated_at: currentDate
    } as IUserEntity)
    // Aqui envia um sucesso ou seja uma instancia Right
    return right(user)
  }
}
