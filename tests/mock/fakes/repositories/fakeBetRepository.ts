/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { BetEntityKeys, IBetRepository, IInputDeleteBet, IInputUpdateBet } from '@business/repositories/bet/iBetRepository'
import { IBetEntity, InputBetEntity } from '@domain/entities/betEntity'
import { injectable } from 'inversify'

// Aqui nos temos classes com ados marretados
@injectable()
export class FakeBetRepository implements IBetRepository {
  async findAll (): Promise<void | IBetEntity[]> {
    return []
  }

  // Por padrao defini que vai ser uma situacao de fracasso
  async delete (_input: IInputDeleteBet): Promise<IBetEntity | void> {
    return void 0
  }

  async create (i: InputBetEntity, userId: number, gameId: number): Promise<IBetEntity> {
    return {
      ...i,
      id: 1,
      userId,
      gameId,
      secureId: 'uuid-uuid-1234-uuid',
      created_at: new Date(),
      updated_at: new Date()
    }
  }

  async findBy (
    _t: BetEntityKeys,
    _v: IBetEntity[BetEntityKeys]
  ): Promise<IBetEntity | void> {
    return void 0
  }

  async update (_input: IInputUpdateBet): Promise<IBetEntity | void> {
    return void 0
  }
}
// esses elementos estando sendo espiados e poderao ser mocados em testes
export const fakeBetRepositoryFindBy = jest.spyOn(
  FakeBetRepository.prototype,
  'findBy'
)

export const fakeBetRepositoryCreate = jest.spyOn(
  FakeBetRepository.prototype,
  'create'
)

export const fakeBetRepositoryUpdate = jest.spyOn(
  FakeBetRepository.prototype,
  'update'
)

export const fakeBetRepositoryDelete = jest.spyOn(
  FakeBetRepository.prototype,
  'delete'
)

export const fakeBetRepositoryFindAll = jest.spyOn(
  FakeBetRepository.prototype,
  'findAll'
)
