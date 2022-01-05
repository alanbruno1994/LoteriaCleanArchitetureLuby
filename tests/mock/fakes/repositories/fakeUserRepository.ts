/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import {
  IInputDeleteUser,
  IInputUpdateUser,
  IUserRepository,
  UserEntityKeys
} from '@root/src/2-business/repositories/user/iUserRepository'
import {
  InputUserEntity,
  IUserEntity
} from '@root/src/1-domain/entities/userEntity'
import { injectable } from 'inversify'

// Aqui nos temos classes com ados marretados
@injectable()
export class FakeUserRepository implements IUserRepository {
  async findAll (): Promise<void | Array<Omit<IUserEntity, 'password'>>> {
    return []
  }

  // Por padrao defini que vai ser uma situacao de fracasso
  async delete (_input: IInputDeleteUser): Promise<IUserEntity | void> {
    return void 0
  }

  async create (i: InputUserEntity, access_profile_id: number): Promise<IUserEntity> {
    return {
      ...i,
      id: 1,
      access_profile_id,
      secure_id: 'uuid-uuid-1234-uuid',
      created_at: new Date(),
      updated_at: new Date()
    }
  }

  async findBy (
    _t: UserEntityKeys,
    _v: IUserEntity[UserEntityKeys]
  ): Promise<IUserEntity | void> {
    return void 0
  }

  async update (_input: IInputUpdateUser): Promise<IUserEntity | void> {
    return void 0
  }
}
// esses elementos estando sendo espiados e poderao ser mocados em testes
export const fakeUserRepositoryFindBy = jest.spyOn(
  FakeUserRepository.prototype,
  'findBy'
)

export const fakeUserRepositoryCreate = jest.spyOn(
  FakeUserRepository.prototype,
  'create'
)

export const fakeUserRepositoryUpdate = jest.spyOn(
  FakeUserRepository.prototype,
  'update'
)

export const fakeUserRepositoryDelete = jest.spyOn(
  FakeUserRepository.prototype,
  'delete'
)

export const fakeUserRepositoryFindAll = jest.spyOn(
  FakeUserRepository.prototype,
  'findAll'
)
