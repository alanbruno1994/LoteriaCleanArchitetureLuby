/* eslint-disable no-void */
import { IInputFindBetByDto, IOutputFindBetByDto } from '@business/dto/bet/findBy'
import { BetErrors } from '@business/modules/errors/bet/betErrors'
import { IBetRepository, IBetRepositoryToken } from '@business/repositories/bet/iBetRepository'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class FindBetByUseCase
implements IAbstractUseCase<IInputFindBetByDto, IOutputFindBetByDto> {
  constructor (
    @inject(IBetRepositoryToken) private readonly betRepository: IBetRepository
  ) {}

  async exec (input: IInputFindBetByDto): Promise<IOutputFindBetByDto> {
    const bet = await this.betRepository.findBy(input.key, input.value)

    if (!bet) {
      return left(BetErrors.betNotFound())
    }

    return right(bet)
  }
}
