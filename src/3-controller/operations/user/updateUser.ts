/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { IOutputUpdateUserDto } from '@business/dto/user/update'
import { UserErrors } from '@business/modules/errors/user/userErrors'
import { AuthorizeAccessProfileUseCase } from '@business/useCases/access'
import { VerifyTokenUseCase } from '@business/useCases/authentication'
import { FindUserByUseCase, UpdateUserUseCase } from '@business/useCases/user'
import { InputUpdateUser } from '@controller/serializers/user'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class UpdateUserOperator extends AbstractOperator<
InputUpdateUser,
IOutputUpdateUserDto
> {
  constructor (
    @inject(VerifyTokenUseCase) private readonly verifyUseCase: VerifyTokenUseCase,
    @inject(FindUserByUseCase) private readonly findUserByUseCase: FindUserByUseCase,
    @inject(UpdateUserUseCase) private readonly updateUserUseCase: UpdateUserUseCase,
    @inject(AuthorizeAccessProfileUseCase) private readonly authorizeAccessProfileUseCase: AuthorizeAccessProfileUseCase
  ) {
    super()
  }

  async run (
    input: InputUpdateUser, secure_id: string, token: string
  ): Promise<IOutputUpdateUserDto> {
    this.exec(input)

    const validToken = await this.verifyUseCase.exec({ token })
    if (validToken.isLeft()) {
      return left(validToken.value)
    }
    const authorize = await this.authorizeAccessProfileUseCase.exec({ id: validToken.value.user_id })
    if (authorize.isLeft()) {
      return left(authorize.value)
    }
    const existentUser = await this.findUserByUseCase.exec({
      key: 'secure_id',
      value: secure_id
    })
    if (existentUser.isLeft()) {
      return left(UserErrors.userNotFound())
    }
    const userUpdated = await this.updateUserUseCase.exec(
      {
        ...existentUser.value,
        name: input.name ? input.name : existentUser.value.name,
        email: input.email ? input.email : existentUser.value.email,
        access_profile_id: input.access_profile_id ? input.access_profile_id : existentUser.value.access_profile_id,
        password: input.password
      },
      { column: 'id', value: existentUser.value.id }
    )
    if (userUpdated.isLeft()) {
      return left(userUpdated.value)
    }
    return right(userUpdated.value)
  }
}
