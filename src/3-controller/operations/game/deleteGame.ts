import { IOutputDeleteGameDto } from '@business/dto/game/delete'
import { GameErrors } from '@business/modules/errors/game/gameErrors'
import { DeleteGameUseCase } from '@business/useCases/game/deleteGameUseCase'
import { FindGameByUseCase } from '@business/useCases/game/findGameByUseCase'
import { InputDeleteGame } from '@controller/serializers/game/inputDeleteUser'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class DeleteGameOperator extends AbstractOperator<
InputDeleteGame,
IOutputDeleteGameDto
> {
  constructor (
    @inject(FindGameByUseCase) private readonly findGameByUseCase: FindGameByUseCase,
    @inject(DeleteGameUseCase) private readonly deleteGameUseCase: DeleteGameUseCase
  ) {
    super()
  }

  async run (
    input: InputDeleteGame
  ): Promise<IOutputDeleteGameDto> {
    await this.exec(input)
    const gameForDeletion = await this.findGameByUseCase.exec({
      key: 'secureId',
      value: input.secureId
    })

    if (gameForDeletion.isLeft()) {
      return left(GameErrors.gameNotFound())
    }

    const gameResult = await this.deleteGameUseCase.exec({
      key: 'id',
      value: gameForDeletion.value.id
    })

    if (gameResult.isLeft()) {
      return left(gameResult.value)
    }

    return right(gameResult.value)
  }
}
