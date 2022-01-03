import { UserErrors } from '@business/modules/errors/user/userErrors'
import { FindUserByUseCase } from '@business/useCases/user/findUserByUseCase'
import { InputByUser } from '@controller/serializers/user/inputByUser'
import { IUserEntity } from '@root/src/1-domain/entities/userEntity'
import { Either, left, right } from '@shared/either'
import { IError } from '@shared/iError'
import { inject, injectable } from 'inversify'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class FindOneUserOperator extends AbstractOperator<
InputByUser,
Either<IError, IUserEntity>
> {
  constructor (
    @inject(FindUserByUseCase) private readonly findUserByUseCase: FindUserByUseCase
  ) {
    super()
  }

  async run (input: InputByUser): Promise<Either<IError, IUserEntity>> {
    this.exec(input)

    const user = await this.findUserByUseCase.exec({
      key: 'secureId',
      value: input.secureId
    })

    if (user.isLeft()) {
      return left(UserErrors.userNotFound())
    }

    Object.defineProperty(user.value, 'id', {
      enumerable: false
    })

    return right(user.value)
  }
}
