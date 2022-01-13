/* eslint-disable @typescript-eslint/naming-convention */
import { UserErrors } from '@business/modules/errors/user/userErrors'
import { IAccessProfileRepositoryToken } from '@business/repositories/accessprofile/iAccessProfileRepository'
import { IUserRepositoryToken } from '@business/repositories/user/iUserRepository'
import { IAuthenticatorServiceToken } from '@business/services/authenticator/iAuthenticator'
import { AuthorizeAccessProfileUseCase } from '@business/useCases/access'
import { VerifyTokenUseCase } from '@business/useCases/authentication'
import { FindUserByUseCase } from '@business/useCases/user'
import { FindOneUserOperator } from '@controller/operations/user'
import { InputByUser } from '@controller/serializers/user'
import { container } from '@shared/ioc/container'
import { fakeUserEntityPlayer } from '@tests/mock/fakes/entities/fakeUserEntity'
import { FakeAccessProfileRepository } from '@tests/mock/fakes/repositories/fakeAccessRepository'
import { FakeUserRepository, fakeUserRepositoryFindBy } from '@tests/mock/fakes/repositories/fakeUserRepository'
import { FakerAuthenticatorServiceToken } from '@tests/mock/fakes/services/fakeAuthenticatorService'
import { FakerAuthorizeAccessProfileUseCase } from '@tests/mock/fakes/useCases/fakeAuthenticatorService'

const token_fake = 'token_valid_fake'
describe('Find one user operator', () => {
  beforeAll(() => {
    container.bind(FindOneUserOperator).to(FindOneUserOperator)
    container.bind(FindUserByUseCase).to(FindUserByUseCase)
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

  test('Should find a user', async () => {
    const inputDeleteUser = new InputByUser({ secure_id: '7b1f3001-6a4b-4bdd-90e9-8a280fff017d' })
    fakeUserRepositoryFindBy.mockImplementationOnce(
      async () => fakeUserEntityPlayer
    )

    const operator = container.get(FindOneUserOperator)
    const user_id = await operator.run(inputDeleteUser,token_fake)

    expect(user_id.isLeft()).toBeFalsy()

    if (user_id.isRight()) {
      expect(user_id.value).toStrictEqual(fakeUserEntityPlayer)
    }

    expect.assertions(2)
  })

  test('Should returns error if findBy of user returns void', async () => {
    const inputDeleteUser = new InputByUser({ secure_id: '7b1f3001-6a4b-4bdd-90e9-8a280fff017d' })
    fakeUserRepositoryFindBy.mockImplementationOnce(
      // eslint-disable-next-line no-void
      async () => void 0
    )
    const operator = container.get(FindOneUserOperator)
    const user_id = await operator.run(inputDeleteUser,token_fake)

    expect(user_id.isRight()).toBeFalsy()

    if (user_id.isLeft()) {
      expect(user_id.value.statusCode).toBe(
        UserErrors.userNotFound().statusCode
      )
      expect(user_id.value.body).toStrictEqual(UserErrors.userNotFound().body)
    }
  })
})
