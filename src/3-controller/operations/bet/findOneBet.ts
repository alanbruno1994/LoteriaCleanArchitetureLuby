import { BetErrors } from '@business/modules/errors/bet/betErrors'
import { FindBetByUseCase } from '@business/useCases/bet/findBetByUseCase'
import { InputByBet } from '@controller/serializers/bet/inputByBet'
import { IBetEntity } from '@domain/entities/betEntity'
import { Either, left, right } from '@shared/either'
import { IError } from '@shared/iError'
import { inject, injectable } from 'inversify'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class FindOneBetOperator extends AbstractOperator<
InputByBet,
Either<IError, IBetEntity>
> {
  constructor (
    @inject(FindBetByUseCase) private readonly findBetByUseCase: FindBetByUseCase
  ) {
    super()
  }

  async run (input: InputByBet): Promise<Either<IError, IBetEntity>> {
    this.exec(input)

    const bet = await this.findBetByUseCase.exec({
      key: 'secure_id',
      value: input.secure_id
    })

    if (bet.isLeft()) {
      return left(BetErrors.betNotFound())
    }

    Object.defineProperty(bet.value, 'id', {
      enumerable: false
    })

    return right(bet.value)
  }
}
