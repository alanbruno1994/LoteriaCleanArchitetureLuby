import { AccessProfileErrors } from '@business/modules/errors/access/accessProfileErrors'
import { IAccessProfileRepositoryToken } from '@business/repositories/accessprofile/iAccessProfileRepository'
import { DeleteAccessProfileUseCase } from '@business/useCases/access/deleteAccessProfileUseCase'
import { FindAccessProfileByUseCase } from '@business/useCases/access/findAccessProfileByUseCase'
import { DeleteAccessProfileOperator } from '@controller/operations/access/deleteAccess'
import { InputDeleteAccessProfile } from '@controller/serializers/access/inputDeleteAccessProfile'
import { container } from '@shared/ioc/container'
import { fakeAccessProfileEntity } from '@tests/mock/fakes/entities/fakeAccessProfileEntity'
import { FakeAccessProfileRepository, fakeAccessProfileRepositoryDelete, fakeAccessProfileRepositoryFindBy } from '@tests/mock/fakes/repositories/fakeAccessRepository'

describe('Delete accessProfile operator', () => {
  beforeAll(() => {
    container.bind(DeleteAccessProfileOperator).to(DeleteAccessProfileOperator)
    container.bind(FindAccessProfileByUseCase).to(FindAccessProfileByUseCase)
    container.bind(DeleteAccessProfileUseCase).to(DeleteAccessProfileUseCase)
    container.bind(IAccessProfileRepositoryToken).to(FakeAccessProfileRepository)
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
    const accessProfileId = await operator.run(inputDeleteAccessProfile)

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
    const accessProfileId = await operator.run(inputDeleteAccessProfile)

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
    const accessProfileId = await operator.run(inputDeleteAccessProfile)

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
