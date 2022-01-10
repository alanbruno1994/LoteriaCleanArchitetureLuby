import { IOutputDeleteUserDto } from '@business/dto/user/delete'
import { UserErrors } from '@business/modules/errors/user/userErrors'
import { AuthorizeAccessProfileUseCase } from '@business/useCases/access/authorizeAccessProfileUseCase'
import { VerifyTokenUseCase } from '@business/useCases/authentication/verifyToken'
import { DeleteUserUseCase } from '@business/useCases/user/deleteUserUseCase'
import { FindUserByUseCase } from '@business/useCases/user/findUserByUseCase'
import { InputDeleteUser } from '@controller/serializers/user/inputDeleteUser'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class DeleteUserOperator extends AbstractOperator<
InputDeleteUser,
IOutputDeleteUserDto
> {
  constructor (
    @inject(FindUserByUseCase) private readonly findUserByUseCase: FindUserByUseCase,
    @inject(VerifyTokenUseCase) private readonly verifyUseCase: VerifyTokenUseCase,
    @inject(DeleteUserUseCase) private readonly deleteUserUseCase: DeleteUserUseCase,
    @inject(AuthorizeAccessProfileUseCase) private readonly authorizeAccessProfileUseCase: AuthorizeAccessProfileUseCase
  ) {
    super()
  }

  async run (
    input: InputDeleteUser,token: string
  ): Promise<IOutputDeleteUserDto> {
    await this.exec(input)
    const validToken = await this.verifyUseCase.exec({ token })
    if (validToken.isLeft()) {
      return left(validToken.value)
    }
    const authorize = await this.authorizeAccessProfileUseCase.exec({ id: validToken.value.user_id })
    if (authorize.isLeft()) {
      return left(authorize.value)
    }
    const userForDeletion = await this.findUserByUseCase.exec({
      key: 'secure_id',
      value: input.secure_id
    })

    if (userForDeletion.isLeft()) {
      return left(UserErrors.userNotFound())
    }

    const userResult = await this.deleteUserUseCase.exec({
      key: 'id',
      value: userForDeletion.value.id
    })

    if (userResult.isLeft()) {
      return left(userResult.value)
    }

    return right(userResult.value)
  }
}
