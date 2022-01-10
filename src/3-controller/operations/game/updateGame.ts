/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { IOutputUpdateGameDto } from '@business/dto/game/update'
import { GameErrors } from '@business/modules/errors/game/gameErrors'
import { AuthorizeAccessProfileUseCase } from '@business/useCases/access/authorizeAccessProfileUseCase'
import { VerifyTokenUseCase } from '@business/useCases/authentication/verifyToken'
import { FindGameByUseCase } from '@business/useCases/game/findGameByUseCase'
import { UpdateGameUseCase } from '@business/useCases/game/updateGameUseCase'
import { InputUpdateGame } from '@controller/serializers/game/inputUpdateGame'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class UpdateGameOperator extends AbstractOperator<
InputUpdateGame,
IOutputUpdateGameDto
> {
  constructor (
    @inject(FindGameByUseCase) private readonly findGameByUseCase: FindGameByUseCase,
    @inject(UpdateGameUseCase) private readonly updateGameUseCase: UpdateGameUseCase,
    @inject(VerifyTokenUseCase) private readonly verifyUseCase: VerifyTokenUseCase,
    @inject(AuthorizeAccessProfileUseCase) private readonly authorizeAccessProfileUseCase: AuthorizeAccessProfileUseCase
  ) {
    super()
  }

  async run (
    input: InputUpdateGame, secure_id: string,token: string
  ): Promise<IOutputUpdateGameDto> {
    this.exec(input)
    const validToken = await this.verifyUseCase.exec({ token })
    if (validToken.isLeft()) {
      return left(validToken.value)
    }
    const authorize = await this.authorizeAccessProfileUseCase.exec({ id: validToken.value.user_id })
    if (authorize.isLeft()) {
      return left(authorize.value)
    }
    const existentGame = await this.findGameByUseCase.exec({
      key: 'secure_id',
      value: secure_id
    })

    if (existentGame.isLeft()) {
      return left(GameErrors.gameNotFound())
    }

    const gameUpdated = await this.updateGameUseCase.exec(
      {
        ...existentGame.value,
        type: input.type ? input.type : existentGame.value.type,
        range: input.range ? input.range : existentGame.value.range,
        price: input.price ? input.price : existentGame.value.price,
        max_number: input.max_number ? input.max_number : existentGame.value.max_number,
        color: input.color ? input.color : existentGame.value.color
      },
      { column: 'id', value: existentGame.value.id }
    )

    if (gameUpdated.isLeft()) {
      return left(gameUpdated.value)
    }

    return right(gameUpdated.value)
  }
}
