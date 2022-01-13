import { IOutputDeleteGameDto } from '@business/dto/game/delete'
import { GameErrors } from '@business/modules/errors/game/gameErrors'
import { AuthorizeAccessProfileUseCase } from '@business/useCases/access'
import { VerifyTokenUseCase } from '@business/useCases/authentication'
import { DeleteGameUseCase, FindGameByUseCase } from '@business/useCases/game'
import { InputDeleteGame } from '@controller/serializers/game'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class DeleteGameOperator extends AbstractOperator<
InputDeleteGame,
IOutputDeleteGameDto
> {
  constructor (
    @inject(VerifyTokenUseCase) private readonly verifyUseCase: VerifyTokenUseCase,
    @inject(FindGameByUseCase) private readonly findGameByUseCase: FindGameByUseCase,
    @inject(DeleteGameUseCase) private readonly deleteGameUseCase: DeleteGameUseCase,
    @inject(AuthorizeAccessProfileUseCase) private readonly authorizeAccessProfileUseCase: AuthorizeAccessProfileUseCase
  ) {
    super()
  }

  async run (
    input: InputDeleteGame,token: string
  ): Promise<IOutputDeleteGameDto> {
    await this.exec(input)
    const validToken = await this.verifyUseCase.exec({ token })
    if (validToken.isLeft()) {
      return left(validToken.value)
    }
    const authorize = await this.authorizeAccessProfileUseCase.exec({ id: validToken.value.user_id })
    if (authorize.isLeft()) {
      return left(authorize.value)
    }
    const gameForDeletion = await this.findGameByUseCase.exec({
      key: 'secure_id',
      value: input.secure_id
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
