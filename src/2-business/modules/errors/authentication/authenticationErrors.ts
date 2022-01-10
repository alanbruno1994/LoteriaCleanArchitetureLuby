import { IError } from '@shared/iError'

export class AuthenticationErrors extends IError {
  static invalidCredentials (): IError {
    const authenticationError = new AuthenticationErrors({
      statusCode: 401,
      body: {
        code: 'AE-001',
        message: 'Email or password wrong',
        shortMessage: 'wrongCredentials'
      }
    })

    return authenticationError
  }

  static invalidToken (): IError {
    const authenticationError = new AuthenticationErrors({
      statusCode: 423,
      body: {
        code: 'AE-002',
        message: 'Token is not valid',
        shortMessage: 'wrongToken'
      }
    })

    return authenticationError
  }

  static erroInValidToken (): IError {
    const authenticationError = new AuthenticationErrors({
      statusCode: 500,
      body: {
        code: 'AE-003',
        message: 'Unable to validate token!',
        shortMessage: 'unableValidToken'
      }
    })

    return authenticationError
  }

  static tokenCreationError (): IError {
    const authenticationError = new AuthenticationErrors({
      statusCode: 500,
      body: {
        code: 'AE-004',
        message: 'Token creation error',
        shortMessage: 'tokenCreationError'
      }
    })

    return authenticationError
  }
}
