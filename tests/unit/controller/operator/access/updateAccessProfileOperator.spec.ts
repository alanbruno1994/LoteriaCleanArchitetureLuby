import { IAccessProfileRepositoryToken } from '@business/repositories/accessprofile/iAccessProfileRepository'
import { FindAccessProfileByUseCase } from '@business/useCases/access/findAccessProfileByUseCase'
import { UpdateAccessProfileUseCase } from '@business/useCases/access/updateAccessProfileUseCase'
import { InputUpdateAccessProfile } from '@controller/serializers/access/inputUpdateAccessProfile'
import { IError } from '@shared/iError'
import { container } from '@shared/ioc/container'
import { fakeCreatedAccessProfileEntity, fakeAccessProfileEntity } from '@tests/mock/fakes/entities/fakeAccessProfileEntity'
import { FakeAccessProfileRepository, fakeAccessProfileRepositoryFindBy, fakeAccessProfileRepositoryUpdate } from '@tests/mock/fakes/repositories/fakeAccessRepository'
import { UpdateAccessProfileOperator } from '@controller/operations/access/updateAccess'
import { AccessProfileErrors } from '@business/modules/errors/access/accessProfileErrors'

describe('Update access profile operator', () => {
  beforeAll(() => {
    container.bind(IAccessProfileRepositoryToken).to(FakeAccessProfileRepository)
    container.bind(UpdateAccessProfileOperator).to(UpdateAccessProfileOperator)
    container.bind(FindAccessProfileByUseCase).to(FindAccessProfileByUseCase)
    container.bind(UpdateAccessProfileUseCase).to(UpdateAccessProfileUseCase)
  })

  afterAll(() => {
    container.unbindAll()
  })

  test('Should update a access', async () => {
    const inputUpdateAccessProfile = new InputUpdateAccessProfile(fakeCreatedAccessProfileEntity)
    const operator = container.get(UpdateAccessProfileOperator)
    fakeAccessProfileRepositoryFindBy.mockImplementationOnce(
      async () => fakeAccessProfileEntity
    )
    fakeAccessProfileRepositoryUpdate.mockImplementation(async () => ({ ...fakeAccessProfileEntity, ...fakeCreatedAccessProfileEntity }))

    const access = await operator.run(inputUpdateAccessProfile, '7b1f3001-6a4b-4bdd-90e9-8a280fff017d')

    expect(access.isLeft()).toBeFalsy()

    if (access.isRight()) {
      expect(access.value.level).toBe('admin')
    }

    expect.assertions(2)
  })

  test('Should returns error if access not found', async () => {
    const inputUpdateAccessProfile = new InputUpdateAccessProfile(fakeCreatedAccessProfileEntity)
    const operator = container.get(UpdateAccessProfileOperator)
    fakeAccessProfileRepositoryFindBy.mockImplementationOnce(
      // eslint-disable-next-line no-void
      async () => void 0
    )
    const access = await operator.run(inputUpdateAccessProfile, '7b1f3001-6a4b-4bdd-90e9-8a280fff017d')

    expect(access.isRight()).toBeFalsy()

    if (access.isLeft()) {
      expect(access.value.statusCode).toBe(AccessProfileErrors.accessProfileNotFound().statusCode)
      expect(access.value.body).toStrictEqual(AccessProfileErrors.accessProfileNotFound().body)
    }

    expect.assertions(3)
  })

  test('Should not update a access with invalid level', async () => {
    const inputUpdateAccessProfile = new InputUpdateAccessProfile({ level: '' })

    try {
      const operator = container.get(UpdateAccessProfileOperator)
      await operator.run(inputUpdateAccessProfile, '7b1f3001-6a4b-4bdd-90e9-8a280fff017d')
    } catch (error) {
      expect(error).toBeInstanceOf(IError)
    }
    expect.assertions(1)
  })
})
