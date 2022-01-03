import { IOutputDeleteBetDto } from '@business/dto/bet/delete'
import { BetErrors } from '@business/modules/errors/bet/betErrors'
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
    @inject(DeleteBetUseCase) private readonly deleteBetUseCase: DeleteBetUseCase
  ) {
    super()
  }

  async run (
    input: InputDeleteBet
  ): Promise<IOutputDeleteBetDto> {
    await this.exec(input)
    const betForDeletion = await this.findBetByUseCase.exec({
      key: 'secureId',
      value: input.secureId
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
