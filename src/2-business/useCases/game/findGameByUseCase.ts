/* eslint-disable no-void */
import { IInputFindGameByDto, IOutputFindGameByDto } from '@business/dto/game/findBy'
import { GameErrors } from '@business/modules/errors/game/gameErrors'
import { IGameRepository, IGameRepositoryToken } from '@business/repositories/game/iGameRepository'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class FindGameByUseCase
implements IAbstractUseCase<IInputFindGameByDto, IOutputFindGameByDto> {
  constructor (
    @inject(IGameRepositoryToken) private readonly gameRepository: IGameRepository
  ) {}

  async exec (input: IInputFindGameByDto): Promise<IOutputFindGameByDto> {
    const game = await this.gameRepository.findBy(input.key, input.value)

    if (game == null) {
      return left(GameErrors.gameNotFound())
    }

    return right(game)
  }
}
