/* eslint-disable object-curly-spacing */
import { IOutputCreateAccessProfileDto } from '@business/dto/access/create'
import { AccessProfileErrors } from '@business/modules/errors/access/accessProfileErrors'
import { AuthorizeAccessProfileUseCase } from '@business/useCases/access/authorizeAccessProfileUseCase'
import { CreateAccessProfileUseCase } from '@business/useCases/access/createAccessProfileUseCase'
import { FindAccessProfileByUseCase } from '@business/useCases/access/findAccessProfileByUseCase'
import { VerifyTokenUseCase } from '@business/useCases/authentication/verifyToken'
import { InputCreateAccessProfile } from '@controller/serializers/access'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class CreateAccessProlfileOperator extends AbstractOperator<
InputCreateAccessProfile,
IOutputCreateAccessProfileDto
> {
  constructor (
    @inject(CreateAccessProfileUseCase) private readonly createAccessProfileUseCase: CreateAccessProfileUseCase,
    @inject(FindAccessProfileByUseCase) private readonly findAccessProfileUseCase: FindAccessProfileByUseCase,
    @inject(VerifyTokenUseCase) private readonly verifyUseCase: VerifyTokenUseCase,
    @inject(AuthorizeAccessProfileUseCase) private readonly authorizeAccessProfileUseCase: AuthorizeAccessProfileUseCase
  ) {
    super()
  }

  async run (input: InputCreateAccessProfile,token: string): Promise<IOutputCreateAccessProfileDto> {
    this.exec(input) // Aqui valida os dados de entrada
    const validToken = await this.verifyUseCase.exec({ token })
    if (validToken.isLeft()) {
      return left(validToken.value)
    }
    const authorize = await this.authorizeAccessProfileUseCase.exec({id: validToken.value.user_id})
    if (authorize?.isLeft()) {
      return left(authorize.value)
    }
    const isAccessAlreadyRegistered = await this.findAccessProfileUseCase.exec({
      key: 'level',
      value: input.level
    })

    if (isAccessAlreadyRegistered.isRight()) {
      return left(AccessProfileErrors.accessProfileLevelAlreadyInUse())
    }

    const accessResult = await this.createAccessProfileUseCase.exec(input)

    if (accessResult.isLeft()) {
      return left(accessResult.value)
    }

    return right(accessResult.value)
  }
}
