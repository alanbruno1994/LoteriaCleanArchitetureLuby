/* eslint-disable no-void */
import { GameErrors } from '@business/modules/errors/game/gameErrors'
import { IAccessProfileRepositoryToken } from '@business/repositories/accessprofile/iAccessProfileRepository'
import { IGameRepositoryToken } from '@business/repositories/game/iGameRepository'
import { IUserRepositoryToken } from '@business/repositories/user/iUserRepository'
import { IAuthenticatorServiceToken } from '@business/services/authenticator/iAuthenticator'
import { AuthorizeAccessProfileUseCase } from '@business/useCases/access'
import { VerifyTokenUseCase } from '@business/useCases/authentication'
import { FindAllGamesUseCase } from '@business/useCases/game'
import { FindAllGamesOperator } from '@controller/operations/game/findAllGames'
import { container } from '@shared/ioc/container'
import { fakeGameList } from '@tests/mock/fakes/entities/fakeGameEntity'
import { FakeAccessProfileRepository } from '@tests/mock/fakes/repositories/fakeAccessRepository'
import { FakeGameRepository, fakeGameRepositoryFindAll } from '@tests/mock/fakes/repositories/fakeGameRepository'
import { FakeUserRepository } from '@tests/mock/fakes/repositories/fakeUserRepository'
import { FakerAuthenticatorServiceToken } from '@tests/mock/fakes/services/fakeAuthenticatorService'
import { FakerAuthorizeAccessProfileUseCase } from '@tests/mock/fakes/useCases/fakeAuthenticatorService'

const token_fake = 'token_valid_fake'
describe('Find all games operator', () => {
  beforeAll(() => {
    container.bind(FindAllGamesUseCase).to(FindAllGamesUseCase)
    container.bind(FindAllGamesOperator).to(FindAllGamesOperator)
    container.bind(IGameRepositoryToken).to(FakeGameRepository)
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

  test('Should find all games', async () => {
    const operator = container.get(FindAllGamesOperator)
    fakeGameRepositoryFindAll.mockImplementationOnce(async () => (fakeGameList))
    const games = await operator.run(token_fake)

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
    const games = await operator.run(token_fake)

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
