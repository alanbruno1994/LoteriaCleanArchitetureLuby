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

  static accessProfileLevelAlreadyInUse (): IError {
    const userErrors = new AccessProfileErrors({
      statusCode: 400,
      body: {
        code: 'AP-006',
        message: 'This level is already in use, please use another',
        shortMessage: 'levelUsedFailed'
      }
    })
    return userErrors
  }

  static notAuthorzieAccessProfile (): IError {
    const access = new AccessProfileErrors({
      statusCode: 423,
      body: {
        code: 'AP-007',
        message: 'You cannot have this access!',
        shortMessage: 'notAuthorize'
      }
    })
    return access
  }

  static notAuthorzieAccessProfileNotUserFound (): IError {
    const access = new AccessProfileErrors({
      statusCode: 423,
      body: {
        code: 'AP-008',
        message: 'The user performing the operation does not exist!',
        shortMessage: 'notAuthorize'
      }
    })
    return access
  }
}
