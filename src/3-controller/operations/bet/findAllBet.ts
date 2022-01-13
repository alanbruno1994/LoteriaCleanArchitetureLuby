import { IOutputFindAllBetDto } from '@business/dto/bet/findAll'
import { VerifyTokenUseCase } from '@business/useCases/authentication'
import { FindAllBetsUseCase } from '@business/useCases/bet'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class FindAllBetOperator extends AbstractOperator<
any,
IOutputFindAllBetDto
> {
  constructor (
    @inject(FindAllBetsUseCase)
    private readonly findAllBetsUseCase: FindAllBetsUseCase,
    @inject(VerifyTokenUseCase) private readonly verifyUseCase: VerifyTokenUseCase
  ) {
    super()
  }

  async run (token: string): Promise<IOutputFindAllBetDto> {
    const validToken = await this.verifyUseCase.exec({ token })
    if (validToken.isLeft()) {
      return left(validToken.value)
    }
    const bets = await this.findAllBetsUseCase.exec()

    if (bets.isLeft()) {
      return left(bets.value)
    }

    return right(bets.value)
  }
}
