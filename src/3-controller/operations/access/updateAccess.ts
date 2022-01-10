/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { IOutputUpdateAccessProfileDto } from '@business/dto/access/update'
import { AccessProfileErrors } from '@business/modules/errors/access/accessProfileErrors'
import { AuthorizeAccessProfileUseCase } from '@business/useCases/access/authorizeAccessProfileUseCase'
import { FindAccessProfileByUseCase } from '@business/useCases/access/findAccessProfileByUseCase'
import { UpdateAccessProfileUseCase } from '@business/useCases/access/updateAccessProfileUseCase'
import { VerifyTokenUseCase } from '@business/useCases/authentication/verifyToken'
import { InputUpdateAccessProfile } from '@controller/serializers/access/inputUpdateAccessProfile'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class UpdateAccessProfileOperator extends AbstractOperator<
InputUpdateAccessProfile,
IOutputUpdateAccessProfileDto
> {
  constructor (
    @inject(FindAccessProfileByUseCase) private readonly findAccessProfileByUseCase: FindAccessProfileByUseCase,
    @inject(UpdateAccessProfileUseCase) private readonly updateAccessProfileUseCase: UpdateAccessProfileUseCase,
    @inject(VerifyTokenUseCase) private readonly verifyUseCase: VerifyTokenUseCase,
    @inject(AuthorizeAccessProfileUseCase) private readonly authorizeAccessProfileUseCase: AuthorizeAccessProfileUseCase
  ) {
    super()
  }

  async run (
    input: InputUpdateAccessProfile, secure_id: string,token: string
  ): Promise<IOutputUpdateAccessProfileDto> {
    this.exec(input)
    const validToken = await this.verifyUseCase.exec({ token })
    if (validToken.isLeft()) {
      return left(validToken.value)
    }
    const authorize = await this.authorizeAccessProfileUseCase.exec({ id: validToken.value.user_id })
    if (authorize.isLeft()) {
      return left(authorize.value)
    }
    const existentAccess = await this.findAccessProfileByUseCase.exec({
      key: 'secure_id',
      value: secure_id
    })

    if (existentAccess.isLeft()) {
      return left(AccessProfileErrors.accessProfileNotFound())
    }

    const roleUpdated = await this.updateAccessProfileUseCase.exec(
      {
        ...existentAccess.value,
        level: input.level ? input.level : existentAccess.value.level
      },
      { column: 'id', value: existentAccess.value.id }
    )

    if (roleUpdated.isLeft()) {
      return left(roleUpdated.value)
    }

    return right(roleUpdated.value)
  }
}
