/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AccessProfileErrors } from '@business/modules/errors/access/accessProfileErrors'
import { UserErrors } from '@business/modules/errors/user/userErrors'
import { FindAccessProfileByUseCase } from '@business/useCases/access/findAccessProfileByUseCase'
import { IOutputCreateUserDto } from '@root/src/2-business/dto/user/create'
import { CreateUserUseCase } from '@root/src/2-business/useCases/user/createUserUseCase'
import { FindUserByUseCase } from '@root/src/2-business/useCases/user/findUserByUseCase'
import { InputCreateUser } from '@root/src/3-controller/serializers/user/inputCreateUser'
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
    @inject(FindAccessProfileByUseCase) private readonly findAccessProileUseCase: FindAccessProfileByUseCase
  ) {
    super()
  }

  async run (input: InputCreateUser): Promise<IOutputCreateUserDto> {
    this.exec(input) // Aqui valida os dados de entrada
    const isUserAlreadyRegistered = await this.findUserUseCase.exec({
      key: 'email',
      value: input.email
    })

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
