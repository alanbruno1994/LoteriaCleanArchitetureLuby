import { IInputVerifyAuthenticateUseCase, IOutputVerifyAuthenticateUseCase } from '@business/dto/authentication/verify'
import { AuthenticationErrors } from '@business/modules/errors/authentication/authenticationErrors'
import {
  IAuthenticatorService,
  IAuthenticatorServiceToken
} from '@root/src/2-business/services/authenticator/iAuthenticator'
import { left, right } from '@shared/either'
import { IError } from '@shared/iError'
import { inject, injectable } from 'inversify'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class VerifyTokenUseCase
implements
    IAbstractUseCase<IInputVerifyAuthenticateUseCase, IOutputVerifyAuthenticateUseCase> {
  constructor (
    @inject(IAuthenticatorServiceToken)
    private readonly authenticatorService: IAuthenticatorService
  ) {}

  async exec (
    input: IInputVerifyAuthenticateUseCase
  ): Promise<IOutputVerifyAuthenticateUseCase> {
    try {
      const token = await this.authenticatorService.verify(input.token)
      if (token instanceof IError) {
        throw new Error()
      } else if (!token.verify) {
        return left(AuthenticationErrors.invalidToken())
      }
      return right(token)
    } catch (error) {
      return left(AuthenticationErrors.erroInValidToken())
    }
  }
}
