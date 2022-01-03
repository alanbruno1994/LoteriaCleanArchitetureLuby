import { IOutputDeleteUserDto } from '@business/dto/user/delete'
import { UserErrors } from '@business/modules/errors/user/userErrors'
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
    @inject(DeleteUserUseCase) private readonly deleteUserUseCase: DeleteUserUseCase
  ) {
    super()
  }

  async run (
    input: InputDeleteUser
  ): Promise<IOutputDeleteUserDto> {
    await this.exec(input)
    const userForDeletion = await this.findUserByUseCase.exec({
      key: 'secureId',
      value: input.secureId
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
