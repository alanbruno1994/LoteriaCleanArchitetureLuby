import { ITimeService, ITimeServiceToken } from '@business/services/time/iTime'
import { FindUserByUseCase, SendMailUseCase, UpdateUserUseCase } from '@business/useCases/user'
import { InputRecoverPassword } from '@controller/serializers/user'
import { IOutputSendMailDto } from '@root/src/2-business/dto/user/sendMail'
import {
  IUniqueIdentifierService,
  IUniqueIdentifierServiceToken
} from '@root/src/2-business/services/uniqueIdentifier/iUniqueIdentifier'
import { left } from '@shared/either'
import { inject, injectable } from 'inversify'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class RecoverPasswordOperator extends AbstractOperator<
InputRecoverPassword,
IOutputSendMailDto
> {
  constructor (
    @inject(FindUserByUseCase) private readonly findUserByUseCase: FindUserByUseCase,
    @inject(SendMailUseCase) private readonly sendMailuseCase: SendMailUseCase,
    @inject(UpdateUserUseCase) private readonly updateUserUseCase: UpdateUserUseCase,
    @inject(IUniqueIdentifierServiceToken)
    private readonly uniqueIdentifier: IUniqueIdentifierService,
    @inject(ITimeServiceToken) private readonly timeService: ITimeService
  ) {
    super()
  }

  async run (input: InputRecoverPassword): Promise<IOutputSendMailDto> {
    this.exec(input)
    const userExists = await this.findUserByUseCase.exec({
      key: 'email',
      value: input.userEmail
    })

    if (userExists.isLeft()) {
      return left(userExists.value)
    }

    const token_recover_password = this.uniqueIdentifier.create()

    const token_recover_password_expire_date = this.timeService.add(
      this.timeService.toMilliseconds('2h')
    )
    const userIsUpdated = await this.updateUserUseCase.exec(
      {
        token_recover_password,
        token_recover_password_expire_date
      },
      { column: 'id', value: userExists.value.id }
    )

    if (userIsUpdated.isLeft()) {
      return left(userIsUpdated.value)
    }

    const formatedRedirectURL = input.redirectUrl.endsWith('/')
      ? input.redirectUrl
      : `${input.redirectUrl}/`

    return this.sendMailuseCase.exec({
      to: input.userEmail,
      subject: 'Password recover',
      payload: {
        name: userExists.value.name,
        redirectUrl: `${formatedRedirectURL}${token_recover_password}`
      },
      templatePath: 'recover_pass'
    })
  }
}
