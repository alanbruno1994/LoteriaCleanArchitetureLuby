/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AccessProfileErrors } from '@business/modules/errors/access/accessProfileErrors'
import { UserErrors } from '@business/modules/errors/user/userErrors'
import { AuthorizeAccessProfileUseCase, FindAccessProfileByUseCase } from '@business/useCases/access'
import { VerifyTokenUseCase } from '@business/useCases/authentication'
import { CreateUserUseCase, FindUserByUseCase } from '@business/useCases/user'
import { InputCreateUser } from '@controller/serializers/user'
import { IOutputCreateUserDto } from '@root/src/2-business/dto/user/create'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class CreateUserAdminOperator extends AbstractOperator<
InputCreateUser,
IOutputCreateUserDto
> {
  constructor (
    @inject(CreateUserUseCase) private readonly createUserUseCase: CreateUserUseCase,
    @inject(FindUserByUseCase) private readonly findUserUseCase: FindUserByUseCase,
    @inject(VerifyTokenUseCase) private readonly verifyUseCase: VerifyTokenUseCase,
    @inject(FindAccessProfileByUseCase) private readonly findAccessProileUseCase: FindAccessProfileByUseCase,
    @inject(AuthorizeAccessProfileUseCase) private readonly authorizeAccessProfileUseCase: AuthorizeAccessProfileUseCase
  ) {
    super()
  }

  async run (input: InputCreateUser,token: string): Promise<IOutputCreateUserDto> {
    this.exec(input) // Aqui valida os dados de entrada
    const isUserAlreadyRegistered = await this.findUserUseCase.exec({
      key: 'email',
      value: input.email
    })
    const validToken = await this.verifyUseCase.exec({ token })
    if (validToken.isLeft()) {
      return left(validToken.value)
    }
    const authorize = await this.authorizeAccessProfileUseCase.exec({ id: validToken.value.user_id })
    if (authorize.isLeft()) {
      return left(authorize.value)
    }
    if (isUserAlreadyRegistered.isRight()) {
      return left(UserErrors.userEmailAlreadyInUse())
    }

    const access = await this.findAccessProileUseCase.exec({
      key: 'level',
      value: 'admin'
    })

    if (access.isLeft()) {
      return left(AccessProfileErrors.accessProfileNotFound())
    }

    const userResult = await this.createUserUseCase.exec({
      ...input,
      access_profile_id: access.value.id
    })

    if (userResult.isLeft()) {
      return left(userResult.value)
    }
    return right(userResult.value)
  }
}
