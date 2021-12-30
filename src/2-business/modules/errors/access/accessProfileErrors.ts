import { IError } from '@shared/iError'

export class AccessProfileErrors extends IError {
  static entityCreationError (): IError {
    const access = new AccessProfileErrors({
      statusCode: 400,
      body: {
        code: 'AP-001',
        message:
          'Error during creation of the access profile entity, please try again later',
        shortMessage: 'entityCreationFailed'
      }
    })
    return access
  }

  static accessProfileNotFound (): IError {
    const access = new AccessProfileErrors({
      statusCode: 404,
      body: {
        code: 'AP-002',
        message: 'Access profile not found',
        shortMessage: 'accessProfileNotFound'
      }
    })
    return access
  }

  static accessProfileNotLoadedCorrectly (): IError {
    const access = new AccessProfileErrors({
      statusCode: 400,
      body: {
        code: 'AP-003',
        message: 'Access profile entity not loaded as espected',
        shortMessage: 'accessProfileNotLoadedCorrectly'
      }
    })
    return access
  }

  static accessProfileFailedToUpdate (): IError {
    const access = new AccessProfileErrors({
      statusCode: 500,
      body: {
        code: 'AP-004',
        message: 'Your access profile could not be updated',
        shortMessage: 'AccessProfileFailedToUpdate'
      }
    })
    return access
  }

  static accessProfileFailedToDelete (): IError {
    const access = new AccessProfileErrors({
      statusCode: 500,
      body: {
        code: 'AP-005',
        message: 'Your access profile could not be delete',
        shortMessage: 'AccessProfileFailedToDelete'
      }
    })
    return access
  }
}