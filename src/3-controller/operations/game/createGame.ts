import { IOutputCreateGameDto } from '@business/dto/game/create'
import { GameErrors } from '@business/modules/errors/game/gameErrors'
import { CreateGameUseCase } from '@business/useCases/game/createGameUseCase'
import { FindGameByUseCase } from '@business/useCases/game/findGameByUseCase'
import { InputCreateGame } from '@controller/serializers/game/inputCreateGame'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class CreateGameOperator extends AbstractOperator<
InputCreateGame,
IOutputCreateGameDto
> {
  constructor (
    @inject(CreateGameUseCase) private readonly createGameUseCase: CreateGameUseCase,
    @inject(FindGameByUseCase) private readonly findGameUseCase: FindGameByUseCase
  ) {
    super()
  }

  async run (input: InputCreateGame): Promise<IOutputCreateGameDto> {
    this.exec(input) // Aqui valida os dados de entrada

    const isGameAlreadyRegistered = await this.findGameUseCase.exec({
      key: 'type',
      value: input.type
    })
    if (isGameAlreadyRegistered.isRight()) {
      return left(GameErrors.gameTypeAlreadyInUse())
    }

    const gameResult = await this.createGameUseCase.exec(input)

    if (gameResult.isLeft()) {
      return left(gameResult.value)
    }

    return right(gameResult.value)
  }
}
