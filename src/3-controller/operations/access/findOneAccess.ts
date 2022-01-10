import { AccessProfileErrors } from '@business/modules/errors/access/accessProfileErrors'
import { AuthorizeAccessProfileUseCase } from '@business/useCases/access/authorizeAccessProfileUseCase'
import { FindAccessProfileByUseCase } from '@business/useCases/access/findAccessProfileByUseCase'
import { VerifyTokenUseCase } from '@business/useCases/authentication/verifyToken'
import { InputByAccessProfile } from '@controller/serializers/access/inputByAccessProfile'
import { IAccessProfileEntity } from '@domain/entities/accessProfileEntity'
import { Either, left, right } from '@shared/either'
import { IError } from '@shared/iError'
import { inject, injectable } from 'inversify'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class FindOneAccessProfileOperator extends AbstractOperator<
InputByAccessProfile,
Either<IError, IAccessProfileEntity>
> {
  constructor (
    @inject(FindAccessProfileByUseCase) private readonly findAccessProfileByUseCase: FindAccessProfileByUseCase,
    @inject(VerifyTokenUseCase) private readonly verifyUseCase: VerifyTokenUseCase,
    @inject(AuthorizeAccessProfileUseCase) private readonly authorizeAccessProfileUseCase: AuthorizeAccessProfileUseCase
  ) {
    super()
  }

  async run (input: InputByAccessProfile,token: string): Promise<Either<IError, IAccessProfileEntity>> {
    this.exec(input)
    const validToken = await this.verifyUseCase.exec({ token })
    if (validToken.isLeft()) {
      return left(validToken.value)
    }
    const authorize = await this.authorizeAccessProfileUseCase.exec({ id: validToken.value.user_id })
    if (authorize.isLeft()) {
      return left(authorize.value)
    }
    const access = await this.findAccessProfileByUseCase.exec({
      key: 'secure_id',
      value: input.secure_id
    })

    if (access.isLeft()) {
      return left(AccessProfileErrors.accessProfileNotFound())// revisar
    }

    Object.defineProperty(access.value, 'id', {
      enumerable: false
    })

    return right(access.value)
  }
}
