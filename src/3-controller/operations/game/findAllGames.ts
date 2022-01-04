import { IOutputFindAllGameDto } from '@business/dto/game/findAll'
import { FindAllGamesUseCase } from '@business/useCases/game/findAllGameUseCase'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class FindAllGamesOperator extends AbstractOperator<
void,
IOutputFindAllGameDto
> {
  constructor (
    @inject(FindAllGamesUseCase)
    private readonly findAllGamesUseCase: FindAllGamesUseCase
  ) {
    super()
  }

  async run (): Promise<IOutputFindAllGameDto> {
    const games = await this.findAllGamesUseCase.exec()

    if (games.isLeft()) {
      return left(games.value)
    }

    return right(games.value)
  }
}
