/* eslint-disable no-void */
import { container } from '@shared/ioc/container'
import { IUniqueIdentifierServiceToken } from '@root/src/2-business/services/uniqueIdentifier/iUniqueIdentifier'
import { FakeUniqueIdentifierService } from '@tests/mock/fakes/services/fakeUniqueIdentifierService'
import { IError } from '@shared/iError'
import { FakeGameRepository, fakeGameRepositoryCreate, fakeGameRepositoryFindBy } from '@tests/mock/fakes/repositories/fakeGameRepository'
import { IGameRepositoryToken } from '@business/repositories/game/iGameRepository'
import { FindGameByUseCase } from '@business/useCases/game/findGameByUseCase'
import { CreateGameOperator } from '@controller/operations/game/createGame'
import { CreateGameUseCase } from '@business/useCases/game/createGameUseCase'
import { InputCreateGame } from '@controller/serializers/game/inputCreateGame'
import { fakeGameEntity } from '@tests/mock/fakes/entities/fakeGameEntity'
import { GameErrors } from '@business/modules/errors/game/gameErrors'
import { VerifyTokenUseCase } from '@business/useCases/authentication/verifyToken'
import { FakerAuthenticatorServiceToken } from '@tests/mock/fakes/services/fakeAuthenticatorService'
import { IAuthenticatorServiceToken } from '@business/services/authenticator/iAuthenticator'
import { AuthorizeAccessProfileUseCase } from '@business/useCases/access/authorizeAccessProfileUseCase'
import { IAccessProfileRepositoryToken } from '@business/repositories/accessprofile/iAccessProfileRepository'
import { FakeAccessProfileRepository } from '@tests/mock/fakes/repositories/fakeAccessRepository'
import { IUserRepositoryToken } from '@business/repositories/user/iUserRepository'
import { FakeUserRepository } from '@tests/mock/fakes/repositories/fakeUserRepository'
import { FakerAuthorizeAccessProfileUseCase } from '@tests/mock/fakes/useCases/fakeAuthenticatorService'

const token_fake = 'token_valid_fake'
describe('Create game operator', () => {
  const gameTypeAlreadyInUseError = GameErrors.gameTypeAlreadyInUse()
  // // const gameNotFoundError = GameProfileErrors.gameProfileNotFound()
  const gameEntityCreationError = GameErrors.entityCreationError()

  beforeAll(() => {
    container
      .bind(IUniqueIdentifierServiceToken)
      .to(FakeUniqueIdentifierService)
    container.bind(IGameRepositoryToken).to(FakeGameRepository)
    container.bind(FindGameByUseCase).to(FindGameByUseCase)
    container.bind(CreateGameOperator).to(CreateGameOperator)
    container.bind(CreateGameUseCase).to(CreateGameUseCase)
    container.bind(AuthorizeAccessProfileUseCase).to(FakerAuthorizeAccessProfileUseCase)
    container
      .bind(IAuthenticatorServiceToken)
      .to(FakerAuthenticatorServiceToken)
    container.bind(VerifyTokenUseCase).to(VerifyTokenUseCase)
    container.bind(IAccessProfileRepositoryToken).to(FakeAccessProfileRepository)
    container.bind(IUserRepositoryToken).to(FakeUserRepository)
  })

  afterAll(() => {
    container.unbindAll()
  })

  test('Should create a game', async () => {
    const inputCreateGame = new InputCreateGame({
      color: 'red',
      type: 'Mega-Sena',
      range: 60,
      max_number: 6,
      price: 2.5
    })

    fakeGameRepositoryCreate.mockImplementationOnce(async () => fakeGameEntity)
    const operator = container.get(CreateGameOperator)
    const game = await operator.run(inputCreateGame,token_fake)
    expect(game.isLeft()).toBeFalsy()
    expect(game.isRight()).toBeTruthy()
    expect.assertions(2)
  })

  test('Should not create a game with invalid color', async () => {
    const inputCreateGame = new InputCreateGame({
      color: 'r',
      type: 'Mega-Sena',
      range: 60,
      max_number: 6,
      price: 2.5
    })

    try {
      const operator = container.get(CreateGameOperator)
      await operator.run(inputCreateGame,token_fake)
    } catch (error) {
      expect(error).toBeInstanceOf(IError)
    }
    expect.assertions(1)
  })

  test('Should not create a game with invalid type', async () => {
    const inputCreateGame = new InputCreateGame({
      color: 'red',
      type: '',
      range: 60,
      max_number: 6,
      price: 2.5
    })

    try {
      const operator = container.get(CreateGameOperator)
      await operator.run(inputCreateGame,token_fake)
    } catch (error) {
      expect(error).toBeInstanceOf(IError)
    }
    expect.assertions(1)
  })

  test('Should not create a game with invalid range', async () => {
    const inputCreateGame = new InputCreateGame({
      color: 'red',
      type: 'Loto',
      range: -10,
      max_number: 6,
      price: 2.5
    })

    try {
      const operator = container.get(CreateGameOperator)
      await operator.run(inputCreateGame,token_fake)
    } catch (error) {
      expect(error).toBeInstanceOf(IError)
    }
    expect.assertions(1)
  })

  test('Should not create a game with invalid max number', async () => {
    const inputCreateGame = new InputCreateGame({
      color: 'red',
      type: 'Loto',
      range: 10,
      max_number: -6,
      price: 2.5
    })

    try {
      const operator = container.get(CreateGameOperator)
      await operator.run(inputCreateGame,token_fake)
    } catch (error) {
      expect(error).toBeInstanceOf(IError)
    }
    expect.assertions(1)
  })

  test('Should not create a game with invalid price', async () => {
    const inputCreateGame = new InputCreateGame({
      color: 'red',
      type: 'Loto',
      range: 10,
      max_number: 6,
      price: -2.5
    })

    try {
      const operator = container.get(CreateGameOperator)
      await operator.run(inputCreateGame,token_fake)
    } catch (error) {
      expect(error).toBeInstanceOf(IError)
    }
    expect.assertions(1)
  })
  test('Should not create a game with an already existent type', async () => {
    const inputCreateGame = new InputCreateGame({
      color: 'red',
      type: 'Mega Sena',
      range: 10,
      max_number: 6,
      price: 2.5
    })

    fakeGameRepositoryFindBy.mockImplementation(async () => fakeGameEntity)
    const operator = container.get(CreateGameOperator)

    const game = await operator.run(inputCreateGame,token_fake)
    expect(game.isLeft()).toBeTruthy()
    expect(game.isRight()).toBeFalsy()

    if (game.isLeft()) {
      expect(game.value.body).toStrictEqual(gameTypeAlreadyInUseError.body)
    }

    expect.assertions(3)
  })

  test('Should not create a game if game repository create method throws', async () => {
    const inputCreateGame = new InputCreateGame({
      color: 'red',
      type: 'Mega Sena',
      range: 10,
      max_number: 6,
      price: 2.5
    })

    fakeGameRepositoryCreate.mockImplementation(async () => {
      throw new Error()
    })
    fakeGameRepositoryFindBy.mockImplementation(async () => void 0)

    const operator = container.get(CreateGameOperator)

    const game = await operator.run(inputCreateGame,token_fake)

    expect(game.isLeft()).toBeTruthy()
    expect(game.isRight()).toBeFalsy()

    if (game.isLeft()) {
      expect(game.value.body).toStrictEqual(gameEntityCreationError.body)
    }

    expect.assertions(3)
  })
})
