/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { IOutputUpdateUserDto } from '@business/dto/user/update'
import { UserErrors } from '@business/modules/errors/user/userErrors'
import { FindUserByUseCase } from '@business/useCases/user/findUserByUseCase'
import { UpdateUserUseCase } from '@business/useCases/user/updateUserUseCase'
import { InputUpdateUser } from '@controller/serializers/user/inputUpdateUser'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class UpdateUserOperator extends AbstractOperator<
InputUpdateUser,
IOutputUpdateUserDto
> {
  constructor (
    @inject(FindUserByUseCase) private readonly findUserByUseCase: FindUserByUseCase,
    @inject(UpdateUserUseCase) private readonly updateUserUseCase: UpdateUserUseCase
  ) {
    super()
  }

  async run (
    input: InputUpdateUser, secureId: string
  ): Promise<IOutputUpdateUserDto> {
    this.exec(input)
    const existentUser = await this.findUserByUseCase.exec({
      key: 'secureId',
      value: secureId
    })

    if (existentUser.isLeft()) {
      return left(UserErrors.userNotFound())
    }

    const userUpdated = await this.updateUserUseCase.exec(
      {
        ...existentUser.value,
        name: input.name ? input.name : existentUser.value.name,
        email: input.email ? input.email : existentUser.value.email,
        accessProfileId: input.accessProfileId ? input.accessProfileId : existentUser.value.accessProfileId,
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
