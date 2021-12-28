/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { AbstractEntity } from '@domain/abstractEntity'
import { ITimestamps } from '@domain/timestamps'
import { Right, right } from '@shared/either'
import { IUserEntity } from './userEntity'

export interface IAccessProfileEntityRelations { // Aqui serve para definir as relacoes da entidade
  user: IUserEntity
}

export interface IAccessProfileEntity extends ITimestamps, Partial<IAccessProfileEntityRelations>{
  id: number | undefined
  secureId: string | undefined
  level: string
}

// O Pick constrói um tipo escolhendo o conjunto de propriedades
export type InputAccessProfileEntity = Pick<
IAccessProfileEntity,
'level'
>

export class AccessProfileEntity extends AbstractEntity<IAccessProfileEntity> {
  static create (props: InputAccessProfileEntity): Right<void, AccessProfileEntity> {
    const currentDate = new Date()// pega a data atual

    const access = new AccessProfileEntity({
      ...props,
      id: undefined,
      secureId: undefined,
      created_at: currentDate,
      updated_at: currentDate
    })
    // Aqui envia um sucesso ou seja uma instancia Right
    return right(access)
  }

  static update (props: Partial<IUserEntity>): Right<void, AccessProfileEntity> {
    const currentDate = new Date()// pega a data atual

    const access = new AccessProfileEntity({
      ...props,
      updated_at: currentDate
    } as IAccessProfileEntity)
    // Aqui envia um sucesso ou seja uma instancia Right
    return right(access)
  }
}
