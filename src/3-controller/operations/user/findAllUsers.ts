import { IOutputFindAllUserDto } from '@business/dto/user/findAll'
import { FindAllUsersUseCase } from '@business/useCases/user/findAllUsersUseCase'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class FindAllUsersOperator extends AbstractOperator<
void,
IOutputFindAllUserDto
> {
  constructor (
    @inject(FindAllUsersUseCase)
    private readonly findAllUsersUseCase: FindAllUsersUseCase
  ) {
    super()
  }

  async run (): Promise<IOutputFindAllUserDto> {
    const users = await this.findAllUsersUseCase.exec()

    if (users.isLeft()) {
      return left(users.value)
    }

    return right(users.value)
  }
}
