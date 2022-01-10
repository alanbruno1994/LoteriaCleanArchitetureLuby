/* eslint-disable no-empty */
import { IAuthenticatorService } from '@business/services/authenticator/iAuthenticator'
import { IError } from '@shared/iError'
import { injectable } from 'inversify'

@injectable()
export class FakerAuthenticatorServiceToken implements IAuthenticatorService {
  async sign (payload: { [k: string]: string | number | boolean }): Promise<string> {
    if (payload) { }
    return 'token_fake'
  }

  async verify (token: string): Promise<{ verify: boolean, user_secure_id: string, user_id: number } | IError> {
    if (token) { }
    return { verify: true, user_secure_id: '', user_id: 1 }
  }
}

export const fakerAuthenticatorServiceSign = jest.spyOn(
  FakerAuthenticatorServiceToken.prototype,
  'sign'
)

export const fakerAuthenticatorServiceVerify = jest.spyOn(
  FakerAuthenticatorServiceToken.prototype,
  'verify'
)
