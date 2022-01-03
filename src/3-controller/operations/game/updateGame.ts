/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { IOutputUpdateGameDto } from '@business/dto/game/update'
import { UserErrors } from '@business/modules/errors/user/userErrors'
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
    @inject(UpdateGameUseCase) private readonly updateGameUseCase: UpdateGameUseCase
  ) {
    super()
  }

  async run (
    input: InputUpdateGame, secureId: string
  ): Promise<IOutputUpdateGameDto> {
    this.exec(input)
    const existentGame = await this.findGameByUseCase.exec({
      key: 'secureId',
      value: secureId
    })

    if (existentGame.isLeft()) {
      return left(UserErrors.userNotFound())
    }

    const gameUpdated = await this.updateGameUseCase.exec(
      {
        ...existentGame.value,
        type: input.type ? input.type : existentGame.value.type,
        range: input.range ? input.range : existentGame.value.range,
        price: input.price ? input.price : existentGame.value.price,
        maxNumber: input.maxNumber ? input.maxNumber : existentGame.value.maxNumber,
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
