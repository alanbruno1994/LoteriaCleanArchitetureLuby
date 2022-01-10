import { IOutputFindAllAccessProfileDto } from '@business/dto/access/findAll'
import { AuthorizeAccessProfileUseCase } from '@business/useCases/access/authorizeAccessProfileUseCase'
import { FindAllAccessProfileUseCase } from '@business/useCases/access/findAllAccessProfileUseCase'
import { VerifyTokenUseCase } from '@business/useCases/authentication/verifyToken'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class FindAllAccessProfileOperator extends AbstractOperator<
any,
IOutputFindAllAccessProfileDto
> {
  constructor (
    @inject(FindAllAccessProfileUseCase)
    private readonly findAllAccessUseCase: FindAllAccessProfileUseCase,
    @inject(VerifyTokenUseCase) private readonly verifyUseCase: VerifyTokenUseCase,
    @inject(AuthorizeAccessProfileUseCase) private readonly authorizeAccessProfileUseCase: AuthorizeAccessProfileUseCase
  ) {
    super()
  }

  async run (token: string,all = false): Promise<IOutputFindAllAccessProfileDto> {
    const access = await this.findAllAccessUseCase.exec({ all })
    const validToken = await this.verifyUseCase.exec({ token })
    if (validToken.isLeft()) {
      return left(validToken.value)
    }
    const authorize = await this.authorizeAccessProfileUseCase.exec({ id: validToken.value.user_id })
    if (authorize.isLeft()) {
      return left(authorize.value)
    }
    if (access.isLeft()) {
      return left(access.value)
    }

    return right(access.value)
  }
}
