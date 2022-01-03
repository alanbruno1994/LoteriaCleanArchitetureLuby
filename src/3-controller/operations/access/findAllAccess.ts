import { IOutputFindAllAccessProfileDto } from '@business/dto/access/findAll'
import { FindAllAccessProfileUseCase } from '@business/useCases/access/findAllAccessProfileUseCase'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class FindAllAccessProfileOperator extends AbstractOperator<
void,
IOutputFindAllAccessProfileDto
> {
  constructor (
    @inject(FindAllAccessProfileUseCase)
    private readonly findAllAccessUseCase: FindAllAccessProfileUseCase
  ) {
    super()
  }

  async run (): Promise<IOutputFindAllAccessProfileDto> {
    const access = await this.findAllAccessUseCase.exec()

    if (access.isLeft()) {
      return left(access.value)
    }

    return right(access.value)
  }
}
