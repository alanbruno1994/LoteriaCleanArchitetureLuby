import { AccessProfileErrors } from '@business/modules/errors/access/accessProfileErrors'
import { UserErrors } from '@business/modules/errors/user/userErrors'
import { FindAccessProfileByUseCase } from '@business/useCases/access'
import { CreateUserUseCase, FindUserByUseCase } from '@business/useCases/user'
import { InputCreateUser } from '@controller/serializers/user'
import { IOutputCreateUserDto } from '@root/src/2-business/dto/user/create'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class CreateUserPlayerOperator extends AbstractOperator<
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
      value: 'player'
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
