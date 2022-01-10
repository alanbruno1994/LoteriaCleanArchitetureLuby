import { IOutputCreateGameDto } from '@business/dto/game/create'
import { GameErrors } from '@business/modules/errors/game/gameErrors'
import { AuthorizeAccessProfileUseCase } from '@business/useCases/access/authorizeAccessProfileUseCase'
import { VerifyTokenUseCase } from '@business/useCases/authentication/verifyToken'
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
    @inject(VerifyTokenUseCase) private readonly verifyUseCase: VerifyTokenUseCase,
    @inject(CreateGameUseCase) private readonly createGameUseCase: CreateGameUseCase,
    @inject(FindGameByUseCase) private readonly findGameUseCase: FindGameByUseCase,
    @inject(AuthorizeAccessProfileUseCase) private readonly authorizeAccessProfileUseCase: AuthorizeAccessProfileUseCase
  ) {
    super()
  }

  async run (input: InputCreateGame,token: string): Promise<IOutputCreateGameDto> {
    this.exec(input) // Aqui valida os dados de entrada
    const validToken = await this.verifyUseCase.exec({ token })
    if (validToken.isLeft()) {
      return left(validToken.value)
    }
    const authorize = await this.authorizeAccessProfileUseCase.exec({ id: validToken.value.user_id })
    if (authorize.isLeft()) {
      return left(authorize.value)
    }
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
