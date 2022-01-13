import { GameErrors } from '@business/modules/errors/game/gameErrors'
import { IAccessProfileRepositoryToken } from '@business/repositories/accessprofile/iAccessProfileRepository'
import { IGameRepositoryToken } from '@business/repositories/game/iGameRepository'
import { IUserRepositoryToken } from '@business/repositories/user/iUserRepository'
import { IAuthenticatorServiceToken } from '@business/services/authenticator/iAuthenticator'
import { AuthorizeAccessProfileUseCase } from '@business/useCases/access'
import { VerifyTokenUseCase } from '@business/useCases/authentication'
import { FindGameByUseCase } from '@business/useCases/game'
import { FindOneGameOperator } from '@controller/operations/game/findOneGame'
import { InputByGame } from '@controller/serializers/game/inputByGame'
import { container } from '@shared/ioc/container'
import { fakeGameEntity } from '@tests/mock/fakes/entities/fakeGameEntity'
import { FakeAccessProfileRepository } from '@tests/mock/fakes/repositories/fakeAccessRepository'
import { FakeGameRepository, fakeGameRepositoryFindBy } from '@tests/mock/fakes/repositories/fakeGameRepository'
import { FakeUserRepository } from '@tests/mock/fakes/repositories/fakeUserRepository'
import { FakerAuthenticatorServiceToken } from '@tests/mock/fakes/services/fakeAuthenticatorService'
import { FakerAuthorizeAccessProfileUseCase } from '@tests/mock/fakes/useCases/fakeAuthenticatorService'

const token_fake = 'token_valid_fake'
describe('Find one game operator', () => {
  beforeAll(() => {
    container.bind(FindOneGameOperator).to(FindOneGameOperator)
    container.bind(FindGameByUseCase).to(FindGameByUseCase)
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

  test('Should find a game', async () => {
    const inputDeleteGame = new InputByGame({ secure_id: '7b1f3001-6a4b-4bdd-90e9-8a280fff017d' })
    fakeGameRepositoryFindBy.mockImplementationOnce(
      async () => fakeGameEntity
    )

    const operator = container.get(FindOneGameOperator)
    const game_id = await operator.run(inputDeleteGame,token_fake)

    expect(game_id.isLeft()).toBeFalsy()

    if (game_id.isRight()) {
      expect(game_id.value).toStrictEqual(fakeGameEntity)
    }

    expect.assertions(2)
  })

  test('Should returns error if findBy of game returns void', async () => {
    const inputDeleteGame = new InputByGame({ secure_id: '7b1f3001-6a4b-4bdd-90e9-8a280fff017d' })
    fakeGameRepositoryFindBy.mockImplementationOnce(
      // eslint-disable-next-line no-void
      async () => void 0
    )
    const operator = container.get(FindOneGameOperator)
    const game_id = await operator.run(inputDeleteGame,token_fake)

    expect(game_id.isRight()).toBeFalsy()

    if (game_id.isLeft()) {
      expect(game_id.value.statusCode).toBe(
        GameErrors.gameNotFound().statusCode
      )
      expect(game_id.value.body).toStrictEqual(GameErrors.gameNotFound().body)
    }
  })
})
