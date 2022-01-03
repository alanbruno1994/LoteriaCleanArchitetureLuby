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
  })

  afterAll(() => {
    container.unbindAll()
  })

  test('Should create a game', async () => {
    const inputCreateGame = new InputCreateGame({
      color: 'red',
      type: 'Mega-Sena',
      range: 60,
      maxNumber: 6,
      price: 2.5
    })

    fakeGameRepositoryCreate.mockImplementationOnce(async () => fakeGameEntity)
    const operator = container.get(CreateGameOperator)
    const game = await operator.run(inputCreateGame)
    expect(game.isLeft()).toBeFalsy()
    expect(game.isRight()).toBeTruthy()
    expect.assertions(2)
  })

  test('Should not create a game with invalid color', async () => {
    const inputCreateGame = new InputCreateGame({
      color: 'r',
      type: 'Mega-Sena',
      range: 60,
      maxNumber: 6,
      price: 2.5
    })

    try {
      const operator = container.get(CreateGameOperator)
      await operator.run(inputCreateGame)
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
      maxNumber: 6,
      price: 2.5
    })

    try {
      const operator = container.get(CreateGameOperator)
      await operator.run(inputCreateGame)
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
      maxNumber: 6,
      price: 2.5
    })

    try {
      const operator = container.get(CreateGameOperator)
      await operator.run(inputCreateGame)
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
      maxNumber: -6,
      price: 2.5
    })

    try {
      const operator = container.get(CreateGameOperator)
      await operator.run(inputCreateGame)
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
      maxNumber: 6,
      price: -2.5
    })

    try {
      const operator = container.get(CreateGameOperator)
      await operator.run(inputCreateGame)
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
      maxNumber: 6,
      price: 2.5
    })

    fakeGameRepositoryFindBy.mockImplementation(async () => fakeGameEntity)
    const operator = container.get(CreateGameOperator)

    const game = await operator.run(inputCreateGame)
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
      maxNumber: 6,
      price: 2.5
    })

    fakeGameRepositoryCreate.mockImplementation(async () => {
      throw new Error()
    })
    fakeGameRepositoryFindBy.mockImplementation(async () => void 0)

    const operator = container.get(CreateGameOperator)

    const game = await operator.run(inputCreateGame)

    expect(game.isLeft()).toBeTruthy()
    expect(game.isRight()).toBeFalsy()

    if (game.isLeft()) {
      expect(game.value.body).toStrictEqual(gameEntityCreationError.body)
    }

    expect.assertions(3)
  })
})
