import { IOutputUpdateBetDto } from '@business/dto/bet/update'
import { BetErrors } from '@business/modules/errors/bet/betErrors'
import { GameErrors } from '@business/modules/errors/game/gameErrors'
import { UserErrors } from '@business/modules/errors/user/userErrors'
import { AuthorizeAccessProfileUseCase } from '@business/useCases/access'
import { VerifyTokenUseCase } from '@business/useCases/authentication'
import { FindBetByUseCase, UpdateBetUseCase } from '@business/useCases/bet'
import { FindGameByUseCase } from '@business/useCases/game'
import { FindUserByUseCase } from '@business/useCases/user'
import { InputUpdateBet } from '@controller/serializers/bet'
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
    @inject(UpdateBetUseCase) private readonly updateRoleUseCase: UpdateBetUseCase,
    @inject(VerifyTokenUseCase) private readonly verifyUseCase: VerifyTokenUseCase,
    @inject(AuthorizeAccessProfileUseCase) private readonly authorizeAccessProfileUseCase: AuthorizeAccessProfileUseCase
  ) {
    super()
  }

  async run (
    input: InputUpdateBet, secure_id: string,token: string
  ): Promise<IOutputUpdateBetDto> {
    this.exec(input)
    const validToken = await this.verifyUseCase.exec({ token })
    if (validToken.isLeft()) {
      return left(validToken.value)
    }
    const authorize = await this.authorizeAccessProfileUseCase.exec({ id: validToken.value.user_id })
    if (authorize.isLeft()) {
      return left(authorize.value)
    }
    const existentBet = await this.findBetByUseCase.exec({
      key: 'secure_id',
      value: secure_id
    })

    if (existentBet.isLeft()) {
      return left(BetErrors.betNotFound())
    }

    if (input.user_id) {
      const isUserAlreadyRegistered = await this.findUserUseCase.exec({
        key: 'id',
        value: input.user_id
      })

      if (isUserAlreadyRegistered.isLeft()) {
        return left(UserErrors.userNotFound())
      }
    }
    if (input.game_id) {
      const isGameAlreadyRegistered = await this.findGameUseCase.exec({
        key: 'id',
        value: input.game_id
      })

      if (isGameAlreadyRegistered.isLeft()) {
        return left(GameErrors.gameNotFound())
      }
    }
    const betUpdated = await this.updateRoleUseCase.exec(
      {
        ...existentBet.value,
        user_id: input.user_id ? input.user_id : existentBet.value.user_id,
        game_id: input.game_id ? input.game_id : existentBet.value.game_id,
        price_game: input.price_game ? input.price_game : existentBet.value.price_game,
        number_choose: input.number_choose ? input.number_choose : existentBet.value.number_choose
      },
      { column: 'id', value: existentBet.value.id }
    )

    if (betUpdated.isLeft()) {
      return left(betUpdated.value)
    }

    return right(betUpdated.value)
  }
}
