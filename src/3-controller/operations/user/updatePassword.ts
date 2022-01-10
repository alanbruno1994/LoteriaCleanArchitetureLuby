import { UserErrors } from '@business/modules/errors/user/userErrors'
import { ITimeService, ITimeServiceToken } from '@business/services/time/iTime'
import { InputUpdatePassword } from '@controller/serializers/user/inputUpdatePassword'
import { FindUserByUseCase } from '@root/src/2-business/useCases/user/findUserByUseCase'
import { UpdateUserUseCase } from '@root/src/2-business/useCases/user/updateUserUseCase'
import { Either, left } from '@shared/either'
import { IError } from '@shared/iError'
import { inject, injectable } from 'inversify'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class UpdatePasswordOperator extends AbstractOperator<
InputUpdatePassword,
Either<IError, void>
> {
  constructor (
    @inject(FindUserByUseCase) private readonly findUserByUseCase: FindUserByUseCase,
    @inject(UpdateUserUseCase) private readonly updateUserUseCase: UpdateUserUseCase,
    @inject(ITimeServiceToken) private readonly timeService: ITimeService
  ) {
    super()
  }

  async run (input: InputUpdatePassword): Promise<Either<IError, void>> {
    this.exec(input)
    const userExists = await this.findUserByUseCase.exec({
      key: 'token_recover_password',
      value: input.tokenRecover
    })
    if (userExists.isLeft()) {
      return left(userExists.value)
    }
    if (!this.timeService.compare(new Date().getMilliseconds(),userExists.value.token_recover_password_expire_date.getMilliseconds())) {
      return left(UserErrors.userExpiredToken())
    }
    const userIsUpdated = await this.updateUserUseCase.exec(
      {
        password: input.password
      },
      { column: 'id', value: userExists.value.id }
    )
    if (userIsUpdated.isLeft()) {
      return left(userIsUpdated.value)
    }
    return void 0
  }
}
