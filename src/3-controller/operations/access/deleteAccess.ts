import { IOutputDeleteAccessProfileDto } from '@business/dto/access/delete'
import { AccessProfileErrors } from '@business/modules/errors/access/accessProfileErrors'
import { AuthorizeAccessProfileUseCase } from '@business/useCases/access/authorizeAccessProfileUseCase'
import { DeleteAccessProfileUseCase } from '@business/useCases/access/deleteAccessProfileUseCase'
import { FindAccessProfileByUseCase } from '@business/useCases/access/findAccessProfileByUseCase'
import { VerifyTokenUseCase } from '@business/useCases/authentication/verifyToken'
import { InputDeleteAccessProfile } from '@controller/serializers/access'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class DeleteAccessProfileOperator extends AbstractOperator<
InputDeleteAccessProfile,
IOutputDeleteAccessProfileDto
> {
  constructor (
    @inject(FindAccessProfileByUseCase) private readonly findAccessProfileByUseCase: FindAccessProfileByUseCase,
    @inject(DeleteAccessProfileUseCase) private readonly deleteAccessProfileUseCase: DeleteAccessProfileUseCase,
    @inject(VerifyTokenUseCase) private readonly verifyUseCase: VerifyTokenUseCase,
    @inject(AuthorizeAccessProfileUseCase) private readonly authorizeAccessProfileUseCase: AuthorizeAccessProfileUseCase
  ) {
    super()
  }

  async run (
    input: InputDeleteAccessProfile,token: string
  ): Promise<IOutputDeleteAccessProfileDto> {
    await this.exec(input)
    const validToken = await this.verifyUseCase.exec({ token })
    if (validToken.isLeft()) {
      return left(validToken.value)
    }
    const authorize = await this.authorizeAccessProfileUseCase.exec({ id: validToken.value.user_id })
    if (authorize.isLeft()) {
      return left(authorize.value)
    }
    const accessForDeletion = await this.findAccessProfileByUseCase.exec({
      key: 'secure_id',
      value: input.secure_id
    })

    if (accessForDeletion.isLeft()) {
      return left(AccessProfileErrors.accessProfileNotFound())
    }

    const accessResult = await this.deleteAccessProfileUseCase.exec({
      key: 'id',
      value: accessForDeletion.value.id
    })

    if (accessResult.isLeft()) {
      return left(accessResult.value)
    }

    return right(accessResult.value)
  }
}
