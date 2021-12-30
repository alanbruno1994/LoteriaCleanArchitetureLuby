/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { IOutputFindAllBetDto } from '@business/dto/bet/findAll'
import { BetErrors } from '@business/modules/errors/bet/betErrors'
import { IBetRepository, IBetRepositoryToken } from '@business/repositories/bet/iBetRepository'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class FindAllBetsUseCase
implements IAbstractUseCase<void, IOutputFindAllBetDto> {
  constructor (
    @inject(IBetRepositoryToken) private readonly betRepository: IBetRepository
  ) {}

  async exec (): Promise<IOutputFindAllBetDto> {
    const bets = await this.betRepository.findAll()

    if (!bets) {
      return left(BetErrors.betNotLoadedCorrectly())
    }

    return right(bets)
  }
}
