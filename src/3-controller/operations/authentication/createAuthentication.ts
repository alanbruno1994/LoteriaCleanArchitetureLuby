import { IOutputAuthenticateUseCase } from '@business/dto/authentication/authenticate'
import { AuthenticationErrors } from '@business/modules/errors/authentication/authenticationErrors'
import { UserErrors } from '@business/modules/errors/user/userErrors'
import {
  IHasherService,
  IHasherServiceToken
} from '@root/src/2-business/services/hasher/iHasher'
import { CreateTokenUseCase } from '@root/src/2-business/useCases/authentication/createToken'
import { FindUserByUseCase } from '@root/src/2-business/useCases/user/findUserByUseCase'
import { InputCreateAuthentication } from '@root/src/3-controller/serializers/authenticator/inputCreateAuthetication'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { AbstractOperator } from '../abstractOperator'

export interface ITokenPayload {
  user_id: number
  user_secure_id: string
  [index: string]: string | number
}

@injectable()
export class CreateAuthenticationOperator extends AbstractOperator<
InputCreateAuthentication,
IOutputAuthenticateUseCase
> {
  constructor (
    @inject(FindUserByUseCase) private readonly findUserByUseCase: FindUserByUseCase,
    @inject(CreateTokenUseCase)
    private readonly createTokenUseCase: CreateTokenUseCase,
    @inject(IHasherServiceToken) private readonly hasherService: IHasherService
  ) {
    super()
  }

  async run (
    input: InputCreateAuthentication
  ): Promise<IOutputAuthenticateUseCase> {
    await this.exec(input)
    const userResult = await this.findUserByUseCase.exec({
      key: 'email',
      value: input.email
    })

    if (userResult.isLeft()) {
      return left(UserErrors.userNotFound())
    }
    const isPasswordCorrectResult = await this.hasherService.compare(
      input.password,
      userResult.value.password
    )

    if (!isPasswordCorrectResult) {
      return left(AuthenticationErrors.invalidCredentials())
    }

    const tokenPayload: ITokenPayload = {
      user_id: userResult.value.id,
      user_secure_id: userResult.value.secure_id
    }

    const tokenResult = await this.createTokenUseCase.exec({
      payload: tokenPayload
    })

    if (tokenResult.isLeft()) {
      return left(tokenResult.value)
    }

    return right(tokenResult.value)
  }
}
