import { GameErrors } from '@business/modules/errors/game/gameErrors'
import { FindGameByUseCase } from '@business/useCases/game/findGameByUseCase'
import { InputByGame } from '@controller/serializers/game/inputByGame'
import { IGameEntity } from '@domain/entities/gameEntity'
import { Either, left, right } from '@shared/either'
import { IError } from '@shared/iError'
import { inject, injectable } from 'inversify'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class FindOneGameOperator extends AbstractOperator<
InputByGame,
Either<IError, IGameEntity>
> {
  constructor (
    @inject(FindGameByUseCase) private readonly findGameByUseCase: FindGameByUseCase
  ) {
    super()
  }

  async run (input: InputByGame): Promise<Either<IError, IGameEntity>> {
    this.exec(input)

    const game = await this.findGameByUseCase.exec({
      key: 'secure_id',
      value: input.secure_id
    })

    if (game.isLeft()) {
      return left(GameErrors.gameNotFound())// revisar
    }

    Object.defineProperty(game.value, 'id', {
      enumerable: false
    })

    return right(game.value)
  }
}
