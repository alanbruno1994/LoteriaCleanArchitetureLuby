import { AccessProfileErrors } from '@business/modules/errors/access/accessProfileErrors'
import { IAccessProfileRepositoryToken } from '@business/repositories/accessprofile/iAccessProfileRepository'
import { IUserRepositoryToken } from '@business/repositories/user/iUserRepository'
import { IAuthenticatorServiceToken } from '@business/services/authenticator/iAuthenticator'
import { AuthorizeAccessProfileUseCase } from '@business/useCases/access/authorizeAccessProfileUseCase'
import { DeleteAccessProfileUseCase } from '@business/useCases/access/deleteAccessProfileUseCase'
import { FindAccessProfileByUseCase } from '@business/useCases/access/findAccessProfileByUseCase'
import { VerifyTokenUseCase } from '@business/useCases/authentication/verifyToken'
import { DeleteAccessProfileOperator } from '@controller/operations/access/deleteAccess'
import { InputDeleteAccessProfile } from '@controller/serializers/access/inputDeleteAccessProfile'
import { container } from '@shared/ioc/container'
import { fakeAccessProfileEntity } from '@tests/mock/fakes/entities/fakeAccessProfileEntity'
import { FakeAccessProfileRepository, fakeAccessProfileRepositoryDelete, fakeAccessProfileRepositoryFindBy } from '@tests/mock/fakes/repositories/fakeAccessRepository'
import { FakeUserRepository } from '@tests/mock/fakes/repositories/fakeUserRepository'
import { FakerAuthenticatorServiceToken } from '@tests/mock/fakes/services/fakeAuthenticatorService'
import { FakerAuthorizeAccessProfileUseCase } from '@tests/mock/fakes/useCases/fakeAuthenticatorService'

const token_fake = 'token_valid_fake'
describe('Delete accessProfile operator', () => {
  beforeAll(() => {
    container.bind(DeleteAccessProfileOperator).to(DeleteAccessProfileOperator)
    container.bind(FindAccessProfileByUseCase).to(FindAccessProfileByUseCase)
    container.bind(DeleteAccessProfileUseCase).to(DeleteAccessProfileUseCase)
    container.bind(AuthorizeAccessProfileUseCase).to(FakerAuthorizeAccessProfileUseCase)
    container.bind(IAccessProfileRepositoryToken).to(FakeAccessProfileRepository)
    container
      .bind(IAuthenticatorServiceToken)
      .to(FakerAuthenticatorServiceToken)
    container.bind(VerifyTokenUseCase).to(VerifyTokenUseCase)
    container.bind(IUserRepositoryToken).to(FakeUserRepository)
  })

  afterAll(() => {
    container.unbindAll()
  })

  test('Should delete a accessProfile', async () => {
    const inputDeleteAccessProfile = new InputDeleteAccessProfile({ secure_id: '7b1f3001-6a4b-4bdd-90e9-8a280fff017d' })
    fakeAccessProfileRepositoryFindBy.mockImplementationOnce(
      async () => fakeAccessProfileEntity
    )

    fakeAccessProfileRepositoryDelete.mockImplementationOnce(
      async () => fakeAccessProfileEntity
    )

    const operator = container.get(DeleteAccessProfileOperator)
    const accessProfileId = await operator.run(inputDeleteAccessProfile,token_fake)

    expect(accessProfileId.isLeft()).toBeFalsy()

    if (accessProfileId.isRight()) {
      expect(accessProfileId.value).toStrictEqual(fakeAccessProfileEntity)
    }

    expect.assertions(2)
  })

  test('Should returns error if findBy of accessProfile returns void', async () => {
    const inputDeleteAccessProfile = new InputDeleteAccessProfile({ secure_id: '7b1f3001-6a4b-4bdd-90e9-8a280fff017d' })
    fakeAccessProfileRepositoryFindBy.mockImplementationOnce(
      // eslint-disable-next-line no-void
      async () => void 0
    )
    const operator = container.get(DeleteAccessProfileOperator)
    const accessProfileId = await operator.run(inputDeleteAccessProfile,token_fake)

    expect(accessProfileId.isRight()).toBeFalsy()

    if (accessProfileId.isLeft()) {
      expect(accessProfileId.value.statusCode).toBe(
        AccessProfileErrors.accessProfileNotFound().statusCode
      )
      expect(accessProfileId.value.body).toStrictEqual(AccessProfileErrors.accessProfileNotFound().body)
    }
  })

  test('Should returns error if delete of accessProfile return void', async () => {
    const inputDeleteAccessProfile = new InputDeleteAccessProfile({ secure_id: '7b1f3001-6a4b-4bdd-90e9-8a280fff017d' })
    fakeAccessProfileRepositoryFindBy.mockImplementationOnce(
      async () => fakeAccessProfileEntity
    )

    fakeAccessProfileRepositoryDelete.mockImplementationOnce(
      // eslint-disable-next-line no-void
      async () => void 0
    )

    const operator = container.get(DeleteAccessProfileOperator)
    const accessProfileId = await operator.run(inputDeleteAccessProfile,token_fake)

    expect(accessProfileId.isRight()).toBeFalsy()

    if (accessProfileId.isLeft()) {
      expect(accessProfileId.value.statusCode).toBe(
        AccessProfileErrors.accessProfileFailedToDelete().statusCode
      )
      expect(accessProfileId.value.body).toStrictEqual(
        AccessProfileErrors.accessProfileFailedToDelete().body
      )
    }
  })
})
