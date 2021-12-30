/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { IOutputFindAllGameDto } from '@business/dto/game/findAll'
import { GameErrors } from '@business/modules/errors/game/gameErrors'
import { IGameRepository, IGameRepositoryToken } from '@business/repositories/game/iGameRepository'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class FindAllGamesUseCase
implements IAbstractUseCase<void, IOutputFindAllGameDto> {
  constructor (
    @inject(IGameRepositoryToken) private readonly gameRepository: IGameRepository
  ) {}

  async exec (): Promise<IOutputFindAllGameDto> {
    const users = await this.gameRepository.findAll()

    if (!users) {
      return left(GameErrors.gameNotLoadedCorrectly())
    }

    return right(users)
  }
}
