/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { IOutputUpdateBetDto } from '@business/dto/bet/update'
import { BetErrors } from '@business/modules/errors/bet/betErrors'
import { GameErrors } from '@business/modules/errors/game/gameErrors'
import { UserErrors } from '@business/modules/errors/user/userErrors'
import { FindBetByUseCase } from '@business/useCases/bet/findBetByUseCase'
import { UpdateBetUseCase } from '@business/useCases/bet/updateBetUseCase'
import { FindGameByUseCase } from '@business/useCases/game/findGameByUseCase'
import { FindUserByUseCase } from '@business/useCases/user/findUserByUseCase'
import { InputUpdateBet } from '@controller/serializers/bet/inputUpdateBet'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class UpdateBetOperator extends AbstractOperator<
InputUpdateBet,
IOutputUpdateBetDto
> {
  constructor (
    @inject(FindBetByUseCase) private readonly findBetByUseCase: FindBetByUseCase,
    @inject(FindGameByUseCase) private readonly findGameUseCase: FindGameByUseCase,
    @inject(FindUserByUseCase) private readonly findUserUseCase: FindUserByUseCase,
    @inject(UpdateBetUseCase) private readonly updateRoleUseCase: UpdateBetUseCase
  ) {
    super()
  }

  async run (
    input: InputUpdateBet, secureId: string
  ): Promise<IOutputUpdateBetDto> {
    this.exec(input)
    const existentBet = await this.findBetByUseCase.exec({
      key: 'secureId',
      value: secureId
    })

    if (existentBet.isLeft()) {
      return left(BetErrors.betNotFound())
    }

    if (input.userId) {
      const isUserAlreadyRegistered = await this.findUserUseCase.exec({
        key: 'id',
        value: input.userId
      })

      if (isUserAlreadyRegistered.isRight()) {
        return left(UserErrors.userNotFound())
      }
    }
    if (input.gameId) {
      const isGameAlreadyRegistered = await this.findGameUseCase.exec({
        key: 'id',
        value: input.gameId
      })

      if (isGameAlreadyRegistered.isRight()) {
        return left(GameErrors.gameNotFound())
      }
    }
    const betUpdated = await this.updateRoleUseCase.exec(
      {
        ...existentBet.value,
        userId: input.userId ? input.userId : existentBet.value.userId,
        gameId: input.gameId ? input.gameId : existentBet.value.gameId,
        priceGame: input.priceGame ? input.priceGame : existentBet.value.priceGame,
        numbeChoose: input.numbeChoose ? input.numbeChoose : existentBet.value.numbeChoose
      },
      { column: 'id', value: existentBet.value.id }
    )

    if (betUpdated.isLeft()) {
      return left(betUpdated.value)
    }

    return right(betUpdated.value)
  }
}
