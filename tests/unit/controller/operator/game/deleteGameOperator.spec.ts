import { GameErrors } from '@business/modules/errors/game/gameErrors'
import { IGameRepositoryToken } from '@business/repositories/game/iGameRepository'
import { DeleteGameUseCase } from '@business/useCases/game/deleteGameUseCase'
import { FindGameByUseCase } from '@business/useCases/game/findGameByUseCase'
import { DeleteGameOperator } from '@controller/operations/game/deleteGame'
import { InputDeleteGame } from '@controller/serializers/game/inputDeleteGame'
import { container } from '@shared/ioc/container'
import { fakeGameEntity } from '@tests/mock/fakes/entities/fakeGameEntity'
import { FakeGameRepository, fakeGameRepositoryDelete, fakeGameRepositoryFindBy } from '@tests/mock/fakes/repositories/fakeGameRepository'

describe('Delete game operator', () => {
  beforeAll(() => {
    container.bind(DeleteGameOperator).to(DeleteGameOperator)
    container.bind(FindGameByUseCase).to(FindGameByUseCase)
    container.bind(DeleteGameUseCase).to(DeleteGameUseCase)
    container.bind(IGameRepositoryToken).to(FakeGameRepository)
  })

  afterAll(() => {
    container.unbindAll()
  })

  test('Should delete a game', async () => {
    const inputDeleteGame = new InputDeleteGame({ secureId: '7b1f3001-6a4b-4bdd-90e9-8a280fff017d' })
    fakeGameRepositoryFindBy.mockImplementationOnce(
      async () => fakeGameEntity
    )

    fakeGameRepositoryDelete.mockImplementationOnce(
      async () => fakeGameEntity
    )

    const operator = container.get(DeleteGameOperator)
    const gameId = await operator.run(inputDeleteGame)

    expect(gameId.isLeft()).toBeFalsy()

    if (gameId.isRight()) {
      expect(gameId.value).toStrictEqual(fakeGameEntity)
    }

    expect.assertions(2)
  })

  test('Should returns error if findBy of game returns void', async () => {
    const inputDeleteGame = new InputDeleteGame({ secureId: '7b1f3001-6a4b-4bdd-90e9-8a280fff017d' })
    fakeGameRepositoryFindBy.mockImplementationOnce(
      // eslint-disable-next-line no-void
      async () => void 0
    )
    const operator = container.get(DeleteGameOperator)
    const gameId = await operator.run(inputDeleteGame)

    expect(gameId.isRight()).toBeFalsy()

    if (gameId.isLeft()) {
      expect(gameId.value.statusCode).toBe(
        GameErrors.gameNotFound().statusCode
      )
      expect(gameId.value.body).toStrictEqual(GameErrors.gameNotFound().body)
    }
  })

  test('Should returns error if delete of game return void', async () => {
    const inputDeleteGame = new InputDeleteGame({ secureId: '7b1f3001-6a4b-4bdd-90e9-8a280fff017d' })
    fakeGameRepositoryFindBy.mockImplementationOnce(
      async () => fakeGameEntity
    )

    fakeGameRepositoryDelete.mockImplementationOnce(
      // eslint-disable-next-line no-void
      async () => void 0
    )

    const operator = container.get(DeleteGameOperator)
    const gameId = await operator.run(inputDeleteGame)

    expect(gameId.isRight()).toBeFalsy()

    if (gameId.isLeft()) {
      expect(gameId.value.statusCode).toBe(
        GameErrors.gameFailedToDelete().statusCode
      )
      expect(gameId.value.body).toStrictEqual(
        GameErrors.gameFailedToDelete().body
      )
    }
  })
})
