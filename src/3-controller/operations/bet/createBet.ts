import { IOutputCreateBetDto } from '@business/dto/bet/create'
import { GameErrors } from '@business/modules/errors/game/gameErrors'
import { UserErrors } from '@business/modules/errors/user/userErrors'
import { VerifyTokenUseCase } from '@business/useCases/authentication/verifyToken'
import { CreateBetUseCase } from '@business/useCases/bet/createBetUseCase'
import { FindGameByUseCase } from '@business/useCases/game/findGameByUseCase'
import { InputCreateBet } from '@controller/serializers/bet/inputCreateBet'
import { FindUserByUseCase } from '@root/src/2-business/useCases/user/findUserByUseCase'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class CreateBetOperator extends AbstractOperator<
InputCreateBet,
IOutputCreateBetDto
> {
  constructor (
    @inject(CreateBetUseCase) private readonly createBetUseCase: CreateBetUseCase,
    @inject(FindUserByUseCase) private readonly findUserUseCase: FindUserByUseCase,
    @inject(FindGameByUseCase) private readonly findGameUseCase: FindGameByUseCase,
    @inject(VerifyTokenUseCase) private readonly verifyUseCase: VerifyTokenUseCase
  ) {
    super()
  }

  async run (input: InputCreateBet,token: string): Promise<IOutputCreateBetDto> {
    this.exec(input) // Aqui valida os dados de entrada
    const validToken = await this.verifyUseCase.exec({ token })
    if (validToken.isLeft()) {
      return left(validToken.value)
    }
    const isUserAlreadyRegistered = await this.findUserUseCase.exec({
      key: 'id',
      value: validToken.value.user_id
    })
    if (isUserAlreadyRegistered.isLeft()) {
      return left(UserErrors.userNotFound())
    }
    const isGameAlreadyRegistered = await this.findGameUseCase.exec({
      key: 'id',
      value: validToken.value.user_id
    })
    if (isGameAlreadyRegistered.isLeft()) {
      return left(GameErrors.gameNotFound())
    }

    const gameResult = await this.createBetUseCase.exec({ ...input,user_id: validToken.value.user_id })

    if (gameResult.isLeft()) {
      return left(gameResult.value)
    }

    return right(gameResult.value)
  }
}
