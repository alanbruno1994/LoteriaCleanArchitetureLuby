import { IError } from '@shared/iError'

export class BetErrors extends IError {
  static entityCreationError (): IError {
    const betErrors = new BetErrors({
      statusCode: 400,
      body: {
        code: 'BE-001',
        message:
          'Error during creation of the bet entity, please try again later',
        shortMessage: 'entityCreationFailed'
      }
    })
    return betErrors
  }

  static betNotFound (): IError {
    const betErrors = new BetErrors({
      statusCode: 404,
      body: {
        code: 'BE-002',
        message: 'Bet not found',
        shortMessage: 'betNotFound'
      }
    })
    return betErrors
  }

  static betNotLoadedCorrectly (): IError {
    const betErrors = new BetErrors({
      statusCode: 400,
      body: {
        code: 'BE-003',
        message: 'Bet entity not loaded as espected',
        shortMessage: 'betNotLoadedCorrectly'
      }
    })
    return betErrors
  }

  static betFailedToUpdate (): IError {
    const betErrors = new BetErrors({
      statusCode: 500,
      body: {
        code: 'BE-004',
        message: 'Your bet could not be updated',
        shortMessage: 'betFailedToUpdate'
      }
    })
    return betErrors
  }

  static betFailedToDelete (): IError {
    const betErrors = new BetErrors({
      statusCode: 500,
      body: {
        code: 'BE-005',
        message: 'Your bet could not be delete',
        shortMessage: 'betFailedToDelete'
      }
    })
    return betErrors
  }
}
