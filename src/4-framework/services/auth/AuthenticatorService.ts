import {
  IAuthenticatorService,
  ITokenVerifyFormat
} from '@root/src/2-business/services/authenticator/iAuthenticator'
import { IError } from '@shared/iError'
import { injectable } from 'inversify'
import JWT from 'jsonwebtoken'
import { AuthErrors } from './errors'

require('dotenv').config()
const secret = process.env.secretToken || '34k82'

@injectable()
export class AuthenticatorService implements IAuthenticatorService {
  async sign (payload: { [k: string]: string | number | boolean }): Promise<string> {
    const token = JWT.sign(payload, secret, {
      expiresIn: '1d',
      algorithm: 'HS256'
    })

    return token
  }

  async verify (token: string): Promise<ITokenVerifyFormat | IError> {
    try {
      const tokenPayload = JWT.verify(token, secret) as ITokenVerifyFormat

      return tokenPayload
    } catch (error) {
      if (error instanceof JWT.TokenExpiredError) {
        return AuthErrors.tokenExpired()
      }

      return AuthErrors.tokenError()
    }
  }
}
