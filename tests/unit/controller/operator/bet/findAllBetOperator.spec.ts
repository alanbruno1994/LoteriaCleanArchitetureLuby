/* eslint-disable no-void */
import { BetErrors } from '@business/modules/errors/bet/betErrors'
import { IAccessProfileRepositoryToken } from '@business/repositories/accessprofile/iAccessProfileRepository'
import { IBetRepositoryToken } from '@business/repositories/bet/iBetRepository'
import { IUserRepositoryToken } from '@business/repositories/user/iUserRepository'
import { IAuthenticatorServiceToken } from '@business/services/authenticator/iAuthenticator'
import { AuthorizeAccessProfileUseCase } from '@business/useCases/access/authorizeAccessProfileUseCase'
import { VerifyTokenUseCase } from '@business/useCases/authentication'
import { FindAllBetsUseCase } from '@business/useCases/bet'
import { FindAllBetOperator } from '@controller/operations/bet/findAllBet'
import { container } from '@shared/ioc/container'
import { fakeBetsList } from '@tests/mock/fakes/entities/fakeBetEntity'
import { FakeAccessProfileRepository } from '@tests/mock/fakes/repositories/fakeAccessRepository'
import { FakeBetRepository, fakeBetRepositoryFindAll } from '@tests/mock/fakes/repositories/fakeBetRepository'
import { FakeUserRepository } from '@tests/mock/fakes/repositories/fakeUserRepository'
import { FakerAuthenticatorServiceToken } from '@tests/mock/fakes/services/fakeAuthenticatorService'
import { FakerAuthorizeAccessProfileUseCase } from '@tests/mock/fakes/useCases/fakeAuthenticatorService'
const token_fake = 'token_valid_fake'
describe('Find all bets operator', () => {
  beforeAll(() => {
    container.bind(FindAllBetsUseCase).to(FindAllBetsUseCase)
    container.bind(FindAllBetOperator).to(FindAllBetOperator)
    container.bind(IBetRepositoryToken).to(FakeBetRepository)
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

  test('Should find all bets', async () => {
    const operator = container.get(FindAllBetOperator)
    fakeBetRepositoryFindAll.mockImplementationOnce(async () => (fakeBetsList))
    const bets = await operator.run(token_fake)

    expect(bets.isLeft()).toBeFalsy()

    if (bets.isRight()) {
      expect(bets.value.length).toBe(4)
      bets.value.forEach((bet, index) => {
        expect(bet).toHaveProperty('id') // testa se tem a propriedade id
        expect(bet.id).toBe(index + 1)
      })
    }

    expect.assertions(10)
  })

  test('Should returns error if bet repository return void', async () => {
    const operator = container.get(FindAllBetOperator)
    fakeBetRepositoryFindAll.mockImplementationOnce(async () => void 0)
    const bets = await operator.run(token_fake)

    expect(bets.isRight()).toBeFalsy()

    if (bets.isLeft()) {
      expect(bets.value.statusCode).toBe(
        BetErrors.betNotLoadedCorrectly().statusCode
      )
      expect(bets.value.body).toStrictEqual(
        BetErrors.betNotLoadedCorrectly().body
      )
    }

    expect.assertions(3)
  })
})
