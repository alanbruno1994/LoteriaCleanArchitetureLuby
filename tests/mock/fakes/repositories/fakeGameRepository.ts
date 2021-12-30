/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { injectable } from 'inversify'
import { GameEntityKeys, IGameRepository, IInputDeleteGame, IInputUpdateGame } from '@business/repositories/game/iGameRepository'
import { IGameEntity, InputGameEntity } from '@domain/entities/gameEntity'

// Aqui nos temos classes com ados marretados
@injectable()
export class FakeGameRepository implements IGameRepository {
  async findAll (): Promise<void | IGameEntity[]> {
    return []
  }

  // Por padrao defini que vai ser uma situacao de fracasso
  async delete (_input: IInputDeleteGame): Promise<IGameEntity | void> {
    return void 0
  }

  async create (i: InputGameEntity): Promise<IGameEntity> {
    return {
      ...i,
      id: 1,
      secureId: 'uuid-uuid-1234-uuid',
      created_at: new Date(),
      updated_at: new Date()
    }
  }

  async findBy (
    _t: GameEntityKeys,
    _v: IGameEntity[GameEntityKeys]
  ): Promise<IGameEntity | void> {
    return void 0
  }

  async update (_input: IInputUpdateGame): Promise<IGameEntity | void> {
    return void 0
  }
}
// esses elementos estando sendo espiados e poderao ser mocados em testes
export const fakeGameRepositoryFindBy = jest.spyOn(
  FakeGameRepository.prototype,
  'findBy'
)

export const fakeGameRepositoryCreate = jest.spyOn(
  FakeGameRepository.prototype,
  'create'
)

export const fakeGameRepositoryUpdate = jest.spyOn(
  FakeGameRepository.prototype,
  'update'
)

export const fakeGameRepositoryDelete = jest.spyOn(
  FakeGameRepository.prototype,
  'delete'
)

export const fakeGameRepositoryFindAll = jest.spyOn(
  FakeGameRepository.prototype,
  'findAll'
)
