import { BetErrors } from '@business/modules/errors/bet/betErrors'
import { IAccessProfileRepositoryToken } from '@business/repositories/accessprofile/iAccessProfileRepository'
import { IBetRepositoryToken } from '@business/repositories/bet/iBetRepository'
import { IUserRepositoryToken } from '@business/repositories/user/iUserRepository'
import { IAuthenticatorServiceToken } from '@business/services/authenticator/iAuthenticator'
import { IServiceDataSendToken } from '@business/services/microservices/iServiceDataSend'
import { AuthorizeAccessProfileUseCase } from '@business/useCases/access'
import { VerifyTokenUseCase } from '@business/useCases/authentication'
import { DeleteBetUseCase, FindBetByUseCase } from '@business/useCases/bet'
import { DeleteBetOperator } from '@controller/operations/bet'
import { InputDeleteBet } from '@controller/serializers/bet'
import { container } from '@shared/ioc/container'
import { fakeBetEntity } from '@tests/mock/fakes/entities/fakeBetEntity'
import { FakeAccessProfileRepository } from '@tests/mock/fakes/repositories/fakeAccessRepository'
import { FakeBetRepository, fakeBetRepositoryDelete, fakeBetRepositoryFindBy } from '@tests/mock/fakes/repositories/fakeBetRepository'
import { FakeUserRepository } from '@tests/mock/fakes/repositories/fakeUserRepository'
import { FakerAuthenticatorServiceToken } from '@tests/mock/fakes/services/fakeAuthenticatorService'
import { FakeServiceDataSendBet } from '@tests/mock/fakes/services/fakeServiceDataSendBet'
import { FakerAuthorizeAccessProfileUseCase } from '@tests/mock/fakes/useCases/fakeAuthenticatorService'

const token_fake = 'token_valid_fake'
describe('Delete bet operator', () => {
  beforeAll(() => {
    container.bind(DeleteBetOperator).to(DeleteBetOperator)
    container.bind(FindBetByUseCase).to(FindBetByUseCase)
    container.bind(DeleteBetUseCase).to(DeleteBetUseCase)
    container.bind(IBetRepositoryToken).to(FakeBetRepository)
    container.bind(AuthorizeAccessProfileUseCase).to(FakerAuthorizeAccessProfileUseCase)
    container
      .bind(IAuthenticatorServiceToken)
      .to(FakerAuthenticatorServiceToken)
    container.bind(VerifyTokenUseCase).to(VerifyTokenUseCase)
    container.bind(IAccessProfileRepositoryToken).to(FakeAccessProfileRepository)
    container.bind(IUserRepositoryToken).to(FakeUserRepository)
    container.bind(IServiceDataSendToken).to(FakeServiceDataSendBet)
  })

  afterAll(() => {
    container.unbindAll()
  })

  test('Should delete a bet', async () => {
    const inputDeleteBet = new InputDeleteBet({ secure_id: '7b1f3001-6a4b-4bdd-90e9-8a280fff017d' })
    fakeBetRepositoryFindBy.mockImplementationOnce(
      async () => fakeBetEntity
    )

    fakeBetRepositoryDelete.mockImplementationOnce(
      async () => fakeBetEntity
    )

    const operator = container.get(DeleteBetOperator)
    const betId = await operator.run(inputDeleteBet,token_fake)

    expect(betId.isLeft()).toBeFalsy()

    if (betId.isRight()) {
      expect(betId.value).toStrictEqual(fakeBetEntity)
    }

    expect.assertions(2)
  })

  test('Should returns error if findBy of bet returns void', async () => {
    const inputDeleteBet = new InputDeleteBet({ secure_id: '7b1f3001-6a4b-4bdd-90e9-8a280fff017d' })
    fakeBetRepositoryFindBy.mockImplementationOnce(
      // eslint-disable-next-line no-void
      async () => void 0
    )
    const operator = container.get(DeleteBetOperator)
    const betId = await operator.run(inputDeleteBet,token_fake)

    expect(betId.isRight()).toBeFalsy()

    if (betId.isLeft()) {
      expect(betId.value.statusCode).toBe(
        BetErrors.betNotFound().statusCode
      )
      expect(betId.value.body).toStrictEqual(BetErrors.betNotFound().body)
    }
  })

  test('Should returns error if delete of bet return void', async () => {
    const inputDeleteBet = new InputDeleteBet({ secure_id: '7b1f3001-6a4b-4bdd-90e9-8a280fff017d' })
    fakeBetRepositoryFindBy.mockImplementationOnce(
      async () => fakeBetEntity
    )

    fakeBetRepositoryDelete.mockImplementationOnce(
      // eslint-disable-next-line no-void
      async () => void 0
    )

    const operator = container.get(DeleteBetOperator)
    const betId = await operator.run(inputDeleteBet,token_fake)

    expect(betId.isRight()).toBeFalsy()

    if (betId.isLeft()) {
      expect(betId.value.statusCode).toBe(
        BetErrors.betFailedToDelete().statusCode
      )
      expect(betId.value.body).toStrictEqual(
        BetErrors.betFailedToDelete().body
      )
    }
  })
})
