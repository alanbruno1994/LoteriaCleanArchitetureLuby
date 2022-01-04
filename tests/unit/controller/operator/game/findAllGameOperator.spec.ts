/* eslint-disable no-void */
import { GameErrors } from '@business/modules/errors/game/gameErrors'
import { IGameRepositoryToken } from '@business/repositories/game/iGameRepository'
import { FindAllGamesUseCase } from '@business/useCases/game/findAllGameUseCase'
import { FindAllGamesOperator } from '@controller/operations/game/findAllGames'
import { container } from '@shared/ioc/container'
import { fakeGameList } from '@tests/mock/fakes/entities/fakeGameEntity'
import { FakeGameRepository, fakeGameRepositoryFindAll } from '@tests/mock/fakes/repositories/fakeGameRepository'

describe('Find all games operator', () => {
  beforeAll(() => {
    container.bind(FindAllGamesUseCase).to(FindAllGamesUseCase)
    container.bind(FindAllGamesOperator).to(FindAllGamesOperator)
    container.bind(IGameRepositoryToken).to(FakeGameRepository)
  })

  afterAll(() => {
    container.unbindAll()
  })

  test('Should find all games', async () => {
    const operator = container.get(FindAllGamesOperator)
    fakeGameRepositoryFindAll.mockImplementationOnce(async () => (fakeGameList))
    const games = await operator.run()

    expect(games.isLeft()).toBeFalsy()

    if (games.isRight()) {
      expect(games.value.length).toBe(4)
      games.value.forEach((game, index) => {
        expect(game).toHaveProperty('id') // testa se tem a propriedade id
        expect(game.id).toBe(index + 1)
      })
    }

    expect.assertions(10)
  })

  test('Should returns error if game repository return void', async () => {
    const operator = container.get(FindAllGamesOperator)
    fakeGameRepositoryFindAll.mockImplementationOnce(async () => void 0)
    const games = await operator.run()

    expect(games.isRight()).toBeFalsy()

    if (games.isLeft()) {
      expect(games.value.statusCode).toBe(
        GameErrors.gameNotLoadedCorrectly().statusCode
      )
      expect(games.value.body).toStrictEqual(
        GameErrors.gameNotLoadedCorrectly().body
      )
    }

    expect.assertions(3)
  })
})
