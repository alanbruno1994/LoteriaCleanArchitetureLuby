import { UserErrors } from '@business/modules/errors/user/userErrors'
import { AuthorizeAccessProfileUseCase } from '@business/useCases/access/authorizeAccessProfileUseCase'
import { VerifyTokenUseCase } from '@business/useCases/authentication/verifyToken'
import { FindUserByUseCase } from '@business/useCases/user/findUserByUseCase'
import { InputByUser } from '@controller/serializers/user/inputByUser'
import { IUserEntity } from '@root/src/1-domain/entities/userEntity'
import { Either, left, right } from '@shared/either'
import { IError } from '@shared/iError'
import { inject, injectable } from 'inversify'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class FindOneUserOperator extends AbstractOperator<
InputByUser,
Either<IError, IUserEntity>
> {
  constructor (
    @inject(VerifyTokenUseCase) private readonly verifyUseCase: VerifyTokenUseCase,
    @inject(FindUserByUseCase) private readonly findUserByUseCase: FindUserByUseCase,
    @inject(AuthorizeAccessProfileUseCase) private readonly authorizeAccessProfileUseCase: AuthorizeAccessProfileUseCase
  ) {
    super()
  }

  async run (input: InputByUser,token: string): Promise<Either<IError, IUserEntity>> {
    this.exec(input)

    const validToken = await this.verifyUseCase.exec({ token })
    if (validToken.isLeft()) {
      return left(validToken.value)
    }
    const authorize = await this.authorizeAccessProfileUseCase.exec({ id: validToken.value.user_id })
    if (authorize.isLeft()) {
      return left(authorize.value)
    }
    const user = await this.findUserByUseCase.exec({
      key: 'secure_id',
      value: input.secure_id
    })

    if (user.isLeft()) {
      return left(UserErrors.userNotFound())
    }

    Object.defineProperty(user.value, 'id', {
      enumerable: false
    })

    return right(user.value)
  }
}
