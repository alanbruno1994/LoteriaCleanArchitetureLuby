import { IError } from '@shared/iError'

export class GameErrors extends IError {
  static entityCreationError (): IError {
    const gameErrors = new GameErrors({
      statusCode: 400,
      body: {
        code: 'GA-001',
        message:
          'Error during creation of the game entity, please try again later',
        shortMessage: 'entityCreationFailed'
      }
    })
    return gameErrors
  }

  static gameNotFound (): IError {
    const gameErrors = new GameErrors({
      statusCode: 404,
      body: {
        code: 'GA-002',
        message: 'Game not found',
        shortMessage: 'gameNotFound'
      }
    })
    return gameErrors
  }

  static gameNotLoadedCorrectly (): IError {
    const gameErrors = new GameErrors({
      statusCode: 400,
      body: {
        code: 'GA-003',
        message: 'Game entity not loaded as espected',
        shortMessage: 'gameNotLoadedCorrectly'
      }
    })
    return gameErrors
  }

  static gameFailedToUpdate (): IError {
    const gameErrors = new GameErrors({
      statusCode: 500,
      body: {
        code: 'GA-004',
        message: 'Your game could not be updated',
        shortMessage: 'gameFailedToUpdate'
      }
    })
    return gameErrors
  }

  static gameFailedToDelete (): IError {
    const gameErrors = new GameErrors({
      statusCode: 500,
      body: {
        code: 'GA-005',
        message: 'Your game could not be delete',
        shortMessage: 'gameFailedToDelete'
      }
    })
    return gameErrors
  }
}
