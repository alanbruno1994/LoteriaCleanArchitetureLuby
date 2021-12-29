import { inject, injectable } from 'inversify'
import {
  IUserRepositoryToken
} from '@root/src/2-business/repositories/user/iUserRepository'
import { left, right } from '@shared/either'
import {
  IUniqueIdentifierService,
  IUniqueIdentifierServiceToken
} from '@root/src/2-business/services/uniqueIdentifier/iUniqueIdentifier'
import { IAbstractUseCase } from '../abstractUseCase'
import { IBetRepository } from '@business/repositories/bet/iBetRepository'
import { BetEntity } from '@domain/entities/betEntity'
import { IInputCreateBetDto, IOutputCreateBetDto } from '@business/dto/bet/create'
import { BetErrors } from '@business/modules/errors/bet/betErrors'

@injectable() // Aqui indica que a classe faz parte das injecoes dinamicas
export class CreateBetUseCase
implements IAbstractUseCase<IInputCreateBetDto, IOutputCreateBetDto> {
  // @inject e usado para faz as injecoes dinamicas, ou seja, em tempo de
  // execucao.
  constructor (
    @inject(IUserRepositoryToken) private readonly betRepository: IBetRepository,
    @inject(IUniqueIdentifierServiceToken)
    private readonly uniqueIdentifierService: IUniqueIdentifierService
  ) {}

  async exec (input: IInputCreateBetDto): Promise<IOutputCreateBetDto> {
    const createBet = BetEntity.create(input)
    const user = {
      ...createBet.value.export(),
      secureId: this.uniqueIdentifierService.create()
    }
    try {
      const betEntity = await this.betRepository.create(user, input.userId, input.gameId)

      return right(betEntity)
    } catch (error) {
      return left(BetErrors.entityCreationError())
    }
  }
}
