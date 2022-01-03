import { GameErrors } from '@business/modules/errors/game/gameErrors'
import { IGameRepositoryToken } from '@business/repositories/game/iGameRepository'
import { FindGameByUseCase } from '@business/useCases/game/findGameByUseCase'
import { FindOneGameOperator } from '@controller/operations/game/findOneGame'
import { InputByGame } from '@controller/serializers/game/inputByGame'
import { container } from '@shared/ioc/container'
import { fakeGameEntity } from '@tests/mock/fakes/entities/fakeGameEntity'
import { FakeGameRepository, fakeGameRepositoryFindBy } from '@tests/mock/fakes/repositories/fakeGameRepository'

describe('Find one game operator', () => {
  beforeAll(() => {
    container.bind(FindOneGameOperator).to(FindOneGameOperator)
    container.bind(FindGameByUseCase).to(FindGameByUseCase)
    container.bind(IGameRepositoryToken).to(FakeGameRepository)
  })

  afterAll(() => {
    container.unbindAll()
  })

  test('Should find a game', async () => {
    const inputDeleteGame = new InputByGame({ secureId: '7b1f3001-6a4b-4bdd-90e9-8a280fff017d' })
    fakeGameRepositoryFindBy.mockImplementationOnce(
      async () => fakeGameEntity
    )

    const operator = container.get(FindOneGameOperator)
    const gameId = await operator.run(inputDeleteGame)

    expect(gameId.isLeft()).toBeFalsy()

    if (gameId.isRight()) {
      expect(gameId.value).toStrictEqual(fakeGameEntity)
    }

    expect.assertions(2)
  })

  test('Should returns error if findBy of game returns void', async () => {
    const inputDeleteGame = new InputByGame({ secureId: '7b1f3001-6a4b-4bdd-90e9-8a280fff017d' })
    fakeGameRepositoryFindBy.mockImplementationOnce(
      // eslint-disable-next-line no-void
      async () => void 0
    )
    const operator = container.get(FindOneGameOperator)
    const gameId = await operator.run(inputDeleteGame)

    expect(gameId.isRight()).toBeFalsy()

    if (gameId.isLeft()) {
      expect(gameId.value.statusCode).toBe(
        GameErrors.gameNotFound().statusCode
      )
      expect(gameId.value.body).toStrictEqual(GameErrors.gameNotFound().body)
    }
  })
})
