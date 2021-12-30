import { AuthenticationErrors } from '@business/modules/errors/authentication/authenticationErrors'
import type {
  IInputAuthenticateUseCase,
  IOutputAuthenticateUseCase
} from '@root/src/2-business/dto/authentication/authenticate'
import {
  IAuthenticatorService,
  IAuthenticatorServiceToken
} from '@root/src/2-business/services/authenticator/iAuthenticator'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class CreateTokenUseCase
implements
    IAbstractUseCase<IInputAuthenticateUseCase, IOutputAuthenticateUseCase> {
  constructor (
    @inject(IAuthenticatorServiceToken)
    private readonly authenticatorService: IAuthenticatorService
  ) {}

  async exec (
    input: IInputAuthenticateUseCase
  ): Promise<IOutputAuthenticateUseCase> {
    try {
      const token = await this.authenticatorService.sign(input.payload)

      return right({ token })
    } catch (error) {
      return left(AuthenticationErrors.tokenCreationError())
    }
  }
}
