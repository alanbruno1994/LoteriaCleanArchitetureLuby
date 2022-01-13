import { GameErrors } from '@business/modules/errors/game/gameErrors'
import { IAccessProfileRepositoryToken } from '@business/repositories/accessprofile/iAccessProfileRepository'
import { IGameRepositoryToken } from '@business/repositories/game/iGameRepository'
import { IUserRepositoryToken } from '@business/repositories/user/iUserRepository'
import { IAuthenticatorServiceToken } from '@business/services/authenticator/iAuthenticator'
import { AuthorizeAccessProfileUseCase } from '@business/useCases/access'
import { VerifyTokenUseCase } from '@business/useCases/authentication'
import { FindGameByUseCase, UpdateGameUseCase } from '@business/useCases/game'
import { UpdateGameOperator } from '@controller/operations/game/updateGame'
import { InputUpdateGame } from '@controller/serializers/game/inputUpdateGame'
import { IError } from '@shared/iError'
import { container } from '@shared/ioc/container'
import { fakeCreatedGameEntity, fakeGameEntity } from '@tests/mock/fakes/entities/fakeGameEntity'
import { FakeAccessProfileRepository } from '@tests/mock/fakes/repositories/fakeAccessRepository'
import { FakeGameRepository, fakeGameRepositoryFindBy, fakeGameRepositoryUpdate } from '@tests/mock/fakes/repositories/fakeGameRepository'
import { FakeUserRepository } from '@tests/mock/fakes/repositories/fakeUserRepository'
import { FakerAuthenticatorServiceToken } from '@tests/mock/fakes/services/fakeAuthenticatorService'
import { FakerAuthorizeAccessProfileUseCase } from '@tests/mock/fakes/useCases/fakeAuthenticatorService'

const token_fake = 'token_valid_fake'
describe('Update game operator', () => {
  beforeAll(() => {
    container.bind(IGameRepositoryToken).to(FakeGameRepository)
    container.bind(UpdateGameOperator).to(UpdateGameOperator)
    container.bind(FindGameByUseCase).to(FindGameByUseCase)
    container.bind(UpdateGameUseCase).to(UpdateGameUseCase)
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

  test('Should update a game', async () => {
    const inputUpdateGame = new InputUpdateGame(fakeCreatedGameEntity)
    const operator = container.get(UpdateGameOperator)
    fakeGameRepositoryFindBy.mockImplementationOnce(
      async () => fakeGameEntity
    )
    fakeGameRepositoryUpdate.mockImplementation(async () => ({ ...fakeGameEntity, ...fakeCreatedGameEntity }))

    const game = await operator.run(inputUpdateGame, '7b1f3001-6a4b-4bdd-90e9-8a280fff017d',token_fake)

    expect(game.isLeft()).toBeFalsy()

    if (game.isRight()) {
      expect(game.value.type).toBe('Mega Sena')
    }

    expect.assertions(2)
  })

  test('Should returns error if game not found', async () => {
    const inputUpdateGame = new InputUpdateGame(fakeCreatedGameEntity)
    const operator = container.get(UpdateGameOperator)
    fakeGameRepositoryFindBy.mockImplementationOnce(
      // eslint-disable-next-line no-void
      async () => void 0
    )
    const game = await operator.run(inputUpdateGame, '7b1f3001-6a4b-4bdd-90e9-8a280fff017d',token_fake)

    expect(game.isRight()).toBeFalsy()

    if (game.isLeft()) {
      expect(game.value.statusCode).toBe(GameErrors.gameNotFound().statusCode)
      expect(game.value.body).toStrictEqual(GameErrors.gameNotFound().body)
    }

    expect.assertions(3)
  })

  test('Should not update a game with invalid type', async () => {
    const inputUpdateGame = new InputUpdateGame({
      type: '',
      range: 60,
      max_number: 6,
      price: 2.5,
      color: 'red'
    })

    try {
      const operator = container.get(UpdateGameOperator)
      await operator.run(inputUpdateGame, '7b1f3001-6a4b-4bdd-90e9-8a280fff017d',token_fake)
    } catch (error) {
      expect(error).toBeInstanceOf(IError)
    }
    expect.assertions(1)
  })

  test('Should not update a game with invalid range', async () => {
    const inputUpdateGame = new InputUpdateGame({
      type: 'Mega Sena',
      range: -60,
      max_number: 6,
      price: 2.5,
      color: 'red'
    })

    try {
      const operator = container.get(UpdateGameOperator)
      await operator.run(inputUpdateGame, '7b1f3001-6a4b-4bdd-90e9-8a280fff017d',token_fake)
    } catch (error) {
      expect(error).toBeInstanceOf(IError)
    }
    expect.assertions(1)
  })

  test('Should not update a game with invalid max_number', async () => {
    const inputUpdateGame = new InputUpdateGame({
      type: 'Mega Sena',
      range: 60,
      max_number: -6,
      price: 2.5,
      color: 'red'
    })

    try {
      const operator = container.get(UpdateGameOperator)
      await operator.run(inputUpdateGame, '7b1f3001-6a4b-4bdd-90e9-8a280fff017d',token_fake)
    } catch (error) {
      expect(error).toBeInstanceOf(IError)
    }
    expect.assertions(1)
  })

  test('Should not update a game with invalid price', async () => {
    const inputUpdateGame = new InputUpdateGame({
      type: 'Mega Sena',
      range: 60,
      max_number: 6,
      price: -2.5,
      color: 'red'
    })

    try {
      const operator = container.get(UpdateGameOperator)
      await operator.run(inputUpdateGame, '7b1f3001-6a4b-4bdd-90e9-8a280fff017d',token_fake)
    } catch (error) {
      expect(error).toBeInstanceOf(IError)
    }
    expect.assertions(1)
  })

  test('Should not update a game with invalid color', async () => {
    const inputUpdateGame = new InputUpdateGame({
      type: 'Mega Sena',
      range: 60,
      max_number: 6,
      price: 2.5,
      color: ''
    })

    try {
      const operator = container.get(UpdateGameOperator)
      await operator.run(inputUpdateGame, '7b1f3001-6a4b-4bdd-90e9-8a280fff017d',token_fake)
    } catch (error) {
      expect(error).toBeInstanceOf(IError)
    }
    expect.assertions(1)
  })
})
