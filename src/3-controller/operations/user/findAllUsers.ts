import { IOutputFindAllUserDto } from '@business/dto/user/findAll'
import { AuthorizeAccessProfileUseCase } from '@business/useCases/access'
import { VerifyTokenUseCase } from '@business/useCases/authentication'
import { FindAllUsersUseCase } from '@business/useCases/user'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class FindAllUsersOperator extends AbstractOperator<
any,
IOutputFindAllUserDto
> {
  constructor (
    @inject(FindAllUsersUseCase)
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    @inject(VerifyTokenUseCase) private readonly verifyUseCase: VerifyTokenUseCase,
    @inject(AuthorizeAccessProfileUseCase) private readonly authorizeAccessProfileUseCase: AuthorizeAccessProfileUseCase
  ) {
    super()
  }

  async run (token: string,all = false): Promise<IOutputFindAllUserDto> {
    const users = await this.findAllUsersUseCase.exec({ all })
    const validToken = await this.verifyUseCase.exec({ token })
    if (validToken.isLeft()) {
      return left(validToken.value)
    }
    const authorize = await this.authorizeAccessProfileUseCase.exec({ id: validToken.value.user_id })
    if (authorize.isLeft()) {
      return left(authorize.value)
    }
    if (users.isLeft()) {
      return left(users.value)
    }

    return right(users.value)
  }
}
