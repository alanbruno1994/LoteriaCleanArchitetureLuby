import { IOutputDeleteBetDto } from '@business/dto/bet/delete'
import { BetErrors } from '@business/modules/errors/bet/betErrors'
import { IBetRepository, IBetRepositoryToken, IInputDeleteBet } from '@business/repositories/bet/iBetRepository'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class DeleteBetUseCase
implements IAbstractUseCase<IInputDeleteBet, IOutputDeleteBetDto> {
  constructor (
    @inject(IBetRepositoryToken) private readonly userRepository: IBetRepository
  ) {}

  async exec (input: IInputDeleteBet): Promise<IOutputDeleteBetDto> {
    const betToDelete = await this.userRepository.delete({
      key: input.key,
      value: input.value
    })
    if (!betToDelete) {
      return left(BetErrors.betFailedToDelete())
    }

    return right(betToDelete)
  }
}
