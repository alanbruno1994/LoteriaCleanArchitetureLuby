import { IOutputFindAllGameDto } from '@business/dto/game/findAll'
import { VerifyTokenUseCase } from '@business/useCases/authentication/verifyToken'
import { FindAllGamesUseCase } from '@business/useCases/game/findAllGameUseCase'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class FindAllGamesOperator extends AbstractOperator<
any,
IOutputFindAllGameDto
> {
  constructor (
    @inject(FindAllGamesUseCase)
    private readonly findAllGamesUseCase: FindAllGamesUseCase,
    @inject(VerifyTokenUseCase) private readonly verifyUseCase: VerifyTokenUseCase
  ) {
    super()
  }

  async run (token: string): Promise<IOutputFindAllGameDto> {
    const validToken = await this.verifyUseCase.exec({ token })
    if (validToken.isLeft()) {
      return left(validToken.value)
    }
    const games = await this.findAllGamesUseCase.exec()

    if (games.isLeft()) {
      return left(games.value)
    }

    return right(games.value)
  }
}
