/* eslint-disable no-void */
import { UserErrors } from '@business/modules/errors/user/userErrors'
import { IAccessProfileRepositoryToken } from '@business/repositories/accessprofile/iAccessProfileRepository'
import { IUserRepositoryToken } from '@business/repositories/user/iUserRepository'
import { IAuthenticatorServiceToken } from '@business/services/authenticator/iAuthenticator'
import { AuthorizeAccessProfileUseCase } from '@business/useCases/access'
import { VerifyTokenUseCase } from '@business/useCases/authentication'
import { FindAllUsersUseCase } from '@business/useCases/user'
import { FindAllUsersOperator } from '@controller/operations/user'
import { container } from '@shared/ioc/container'
import { fakeUsersList } from '@tests/mock/fakes/entities/fakeUserEntity'
import { FakeAccessProfileRepository } from '@tests/mock/fakes/repositories/fakeAccessRepository'
import { FakeUserRepository, fakeUserRepositoryFindAll } from '@tests/mock/fakes/repositories/fakeUserRepository'
import { FakerAuthenticatorServiceToken } from '@tests/mock/fakes/services/fakeAuthenticatorService'
import { FakerAuthorizeAccessProfileUseCase } from '@tests/mock/fakes/useCases/fakeAuthenticatorService'

const token_fake = 'token_valid_fake'
describe('Find all users operator', () => {
  beforeAll(() => {
    container.bind(FindAllUsersUseCase).to(FindAllUsersUseCase)
    container.bind(FindAllUsersOperator).to(FindAllUsersOperator)
    container.bind(IUserRepositoryToken).to(FakeUserRepository)
    container.bind(AuthorizeAccessProfileUseCase).to(FakerAuthorizeAccessProfileUseCase)
    container
      .bind(IAuthenticatorServiceToken)
      .to(FakerAuthenticatorServiceToken)
    container.bind(VerifyTokenUseCase).to(VerifyTokenUseCase)
    container.bind(IAccessProfileRepositoryToken).to(FakeAccessProfileRepository)
  })

  afterAll(() => {
    container.unbindAll()
  })

  test('Should find all users', async () => {
    const operator = container.get(FindAllUsersOperator)
    fakeUserRepositoryFindAll.mockImplementationOnce(async () => (fakeUsersList))
    const users = await operator.run(token_fake)

    expect(users.isLeft()).toBeFalsy()

    if (users.isRight()) {
      expect(users.value.length).toBe(4)
      users.value.forEach((user, index) => {
        expect(user).toHaveProperty('id') // testa se tem a propriedade id
        expect(user.id).toBe(index + 1)
      })
    }

    expect.assertions(10)
  })

  test('Should returns error if user repository return void', async () => {
    const operator = container.get(FindAllUsersOperator)
    fakeUserRepositoryFindAll.mockImplementationOnce(async () => void 0)
    const users = await operator.run(token_fake)

    expect(users.isRight()).toBeFalsy()

    if (users.isLeft()) {
      expect(users.value.statusCode).toBe(
        UserErrors.userNotLoadedCorrectly().statusCode
      )
      expect(users.value.body).toStrictEqual(
        UserErrors.userNotLoadedCorrectly().body
      )
    }

    expect.assertions(3)
  })
})
