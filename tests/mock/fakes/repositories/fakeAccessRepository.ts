/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { injectable } from 'inversify'
import { IAccessProfileEntity, InputAccessProfileEntity } from '@domain/entities/accessProfileEntity'
import { AccessProfileEntityKeys, IAccessProfileRepository, IInputDeleteAccess, IInputUpdateAccess } from '@business/repositories/accessprofile/iAccessProfileRepository'

// Aqui nos temos classes com ados marretados
@injectable()
export class FakeAccessProfileRepository implements IAccessProfileRepository {
  async findAll (): Promise<void | IAccessProfileEntity[]> {
    return []
  }

  // Por padrao defini que vai ser uma situacao de fracasso
  async delete (_input: IInputDeleteAccess): Promise<IAccessProfileEntity | void> {
    return void 0
  }

  async create (i: InputAccessProfileEntity): Promise<IAccessProfileEntity> {
    return {
      ...i,
      id: 1,
      secure_id: 'uuid-uuid-1234-uuid',
      created_at: new Date(),
      updated_at: new Date()
    }
  }

  async findBy (
    _t: AccessProfileEntityKeys,
    _v: IAccessProfileEntity[AccessProfileEntityKeys]
  ): Promise<IAccessProfileEntity | void> {
    return void 0
  }

  async update (_input: IInputUpdateAccess): Promise<IAccessProfileEntity | void> {
    return void 0
  }
}
// esses elementos estando sendo espiados e poderao ser mocados em testes
export const fakeAccessProfileRepositoryFindBy = jest.spyOn(
  FakeAccessProfileRepository.prototype,
  'findBy'
)

export const fakeAccessProfileRepositoryCreate = jest.spyOn(
  FakeAccessProfileRepository.prototype,
  'create'
)

export const fakeAccessProfileRepositoryUpdate = jest.spyOn(
  FakeAccessProfileRepository.prototype,
  'update'
)

export const fakeAccessProfileRepositoryDelete = jest.spyOn(
  FakeAccessProfileRepository.prototype,
  'delete'
)

export const fakeAccessProfileRepositoryFindAll = jest.spyOn(
  FakeAccessProfileRepository.prototype,
  'findAll'
)
