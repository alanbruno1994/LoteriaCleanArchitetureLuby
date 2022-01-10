import { IOutputDeleteBetDto } from '@business/dto/bet/delete'
import { BetErrors } from '@business/modules/errors/bet/betErrors'
import { AuthorizeAccessProfileUseCase } from '@business/useCases/access/authorizeAccessProfileUseCase'
import { VerifyTokenUseCase } from '@business/useCases/authentication/verifyToken'
import { DeleteBetUseCase } from '@business/useCases/bet/deleteBetUseCase'
import { FindBetByUseCase } from '@business/useCases/bet/findBetByUseCase'
import { InputDeleteBet } from '@controller/serializers/bet/inputDeleteBet'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class DeleteBetOperator extends AbstractOperator<
InputDeleteBet,
IOutputDeleteBetDto
> {
  constructor (
    @inject(FindBetByUseCase) private readonly findBetByUseCase: FindBetByUseCase,
    @inject(DeleteBetUseCase) private readonly deleteBetUseCase: DeleteBetUseCase,
    @inject(VerifyTokenUseCase) private readonly verifyUseCase: VerifyTokenUseCase,
    @inject(AuthorizeAccessProfileUseCase) private readonly authorizeAccessProfileUseCase: AuthorizeAccessProfileUseCase
  ) {
    super()
  }

  async run (
    input: InputDeleteBet,token: string
  ): Promise<IOutputDeleteBetDto> {
    await this.exec(input)
    const validToken = await this.verifyUseCase.exec({ token })
    if (validToken.isLeft()) {
      return left(validToken.value)
    }
    const authorize = await this.authorizeAccessProfileUseCase.exec({ id: validToken.value.user_id })
    if (authorize.isLeft()) {
      return left(authorize.value)
    }
    const betForDeletion = await this.findBetByUseCase.exec({
      key: 'secure_id',
      value: input.secure_id
    })

    if (betForDeletion.isLeft()) {
      return left(BetErrors.betNotFound())
    }

    const betResult = await this.deleteBetUseCase.exec({
      key: 'id',
      value: betForDeletion.value.id
    })

    if (betResult.isLeft()) {
      return left(betResult.value)
    }

    return right(betResult.value)
  }
}
