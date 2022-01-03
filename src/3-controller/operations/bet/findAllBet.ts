import { IOutputFindAllBetDto } from '@business/dto/bet/findAll'
import { FindAllBetsUseCase } from '@business/useCases/bet/findAllBetUseCase'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class FindAllBetOperator extends AbstractOperator<
void,
IOutputFindAllBetDto
> {
  constructor (
    @inject(FindAllBetsUseCase)
    private readonly findAllBetsUseCase: FindAllBetsUseCase
  ) {
    super()
  }

  async run (): Promise<IOutputFindAllBetDto> {
    const bets = await this.findAllBetsUseCase.exec()

    if (bets.isLeft()) {
      return left(bets.value)
    }

    return right(bets.value)
  }
}
