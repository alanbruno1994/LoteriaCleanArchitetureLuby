import { AccessProfileErrors } from '@business/modules/errors/access/accessProfileErrors'
import { IAccessProfileRepositoryToken } from '@business/repositories/accessprofile/iAccessProfileRepository'
import { IUserRepositoryToken } from '@business/repositories/user/iUserRepository'
import { IAuthenticatorServiceToken } from '@business/services/authenticator/iAuthenticator'
import { AuthorizeAccessProfileUseCase, FindAllAccessProfileUseCase } from '@business/useCases/access'
import { VerifyTokenUseCase } from '@business/useCases/authentication'
import { FindAllAccessProfileOperator } from '@controller/operations/access/findAllAccess'
import { container } from '@shared/ioc/container'
import { fakeAccessProfileList } from '@tests/mock/fakes/entities/fakeAccessProfileEntity'
import { FakeAccessProfileRepository, fakeAccessProfileRepositoryFindAll } from '@tests/mock/fakes/repositories/fakeAccessRepository'
import { FakeUserRepository } from '@tests/mock/fakes/repositories/fakeUserRepository'
import { FakerAuthenticatorServiceToken } from '@tests/mock/fakes/services/fakeAuthenticatorService'
import { FakerAuthorizeAccessProfileUseCase } from '@tests/mock/fakes/useCases/fakeAuthenticatorService'

const token_fake = 'token_valid_fake'
describe('Find all accesses operator', () => {
  beforeAll(() => {
    container.bind(FindAllAccessProfileUseCase).to(FindAllAccessProfileUseCase)
    container.bind(FindAllAccessProfileOperator).to(FindAllAccessProfileOperator)
    container.bind(IAccessProfileRepositoryToken).to(FakeAccessProfileRepository)
    container.bind(AuthorizeAccessProfileUseCase).to(FakerAuthorizeAccessProfileUseCase)
    container
      .bind(IAuthenticatorServiceToken)
      .to(FakerAuthenticatorServiceToken)
    container.bind(VerifyTokenUseCase).to(VerifyTokenUseCase)
    container.bind(IUserRepositoryToken).to(FakeUserRepository)
  })

  afterAll(() => {
    container.unbindAll()
  })

  test('Should find all accesses', async () => {
    const operator = container.get(FindAllAccessProfileOperator)
    fakeAccessProfileRepositoryFindAll.mockImplementationOnce(async () => (fakeAccessProfileList))
    const accesses = await operator.run(token_fake)

    expect(accesses.isLeft()).toBeFalsy()

    if (accesses.isRight()) {
      expect(accesses.value.length).toBe(4)
      accesses.value.forEach((bet, index) => {
        expect(bet).toHaveProperty('id') // testa se tem a propriedade id
        expect(bet.id).toBe(index + 1)
      })
    }

    expect.assertions(10)
  })

  test('Should returns error if acesss profile repository return void', async () => {
    const operator = container.get(FindAllAccessProfileOperator)
    fakeAccessProfileRepositoryFindAll.mockImplementationOnce(async () => void 0)
    const accesses = await operator.run(token_fake)

    expect(accesses.isRight()).toBeFalsy()

    if (accesses.isLeft()) {
      expect(accesses.value.statusCode).toBe(
        AccessProfileErrors.accessProfileNotLoadedCorrectly().statusCode
      )
      expect(accesses.value.body).toStrictEqual(
        AccessProfileErrors.accessProfileNotLoadedCorrectly().body
      )
    }

    expect.assertions(3)
  })
})
