import { GameErrors } from '@business/modules/errors/game/gameErrors'
import { IGameRepositoryToken } from '@business/repositories/game/iGameRepository'
import { FindGameByUseCase } from '@business/useCases/game/findGameByUseCase'
import { UpdateGameUseCase } from '@business/useCases/game/updateGameUseCase'
import { UpdateGameOperator } from '@controller/operations/game/updateGame'
import { InputUpdateGame } from '@controller/serializers/game/inputUpdateGame'
import { IError } from '@shared/iError'
import { container } from '@shared/ioc/container'
import { fakeCreatedGameEntity, fakeGameEntity } from '@tests/mock/fakes/entities/fakeGameEntity'
import { FakeGameRepository, fakeGameRepositoryFindBy, fakeGameRepositoryUpdate } from '@tests/mock/fakes/repositories/fakeGameRepository'

describe('Update game operator', () => {
  beforeAll(() => {
    container.bind(IGameRepositoryToken).to(FakeGameRepository)
    container.bind(UpdateGameOperator).to(UpdateGameOperator)
    container.bind(FindGameByUseCase).to(FindGameByUseCase)
    container.bind(UpdateGameUseCase).to(UpdateGameUseCase)
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

    const game = await operator.run(inputUpdateGame, '7b1f3001-6a4b-4bdd-90e9-8a280fff017d')

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
    const game = await operator.run(inputUpdateGame, '7b1f3001-6a4b-4bdd-90e9-8a280fff017d')

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
      await operator.run(inputUpdateGame, '7b1f3001-6a4b-4bdd-90e9-8a280fff017d')
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
      await operator.run(inputUpdateGame, '7b1f3001-6a4b-4bdd-90e9-8a280fff017d')
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
      await operator.run(inputUpdateGame, '7b1f3001-6a4b-4bdd-90e9-8a280fff017d')
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
      await operator.run(inputUpdateGame, '7b1f3001-6a4b-4bdd-90e9-8a280fff017d')
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
      await operator.run(inputUpdateGame, '7b1f3001-6a4b-4bdd-90e9-8a280fff017d')
    } catch (error) {
      expect(error).toBeInstanceOf(IError)
    }
    expect.assertions(1)
  })
})
