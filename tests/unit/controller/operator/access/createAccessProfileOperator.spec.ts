/* eslint-disable no-void */
import { container } from '@shared/ioc/container'
import { IUniqueIdentifierServiceToken } from '@root/src/2-business/services/uniqueIdentifier/iUniqueIdentifier'
import { FakeUniqueIdentifierService } from '@tests/mock/fakes/services/fakeUniqueIdentifierService'
import { FindAccessProfileByUseCase } from '@business/useCases/access/findAccessProfileByUseCase'
import { FakeAccessProfileRepository, fakeAccessProfileRepositoryCreate, fakeAccessProfileRepositoryFindBy } from '@tests/mock/fakes/repositories/fakeAccessRepository'
import { IAccessProfileRepositoryToken } from '@business/repositories/accessprofile/iAccessProfileRepository'
import { InputCreateAccessProfile } from '@controller/serializers/access/inputCreateAccessProfile'
import { fakeAccessProfileEntity } from '@tests/mock/fakes/entities/fakeAccessProfileEntity'
import { CreateAccessProlfileOperator } from '@controller/operations/access/createAccess'
import { CreateAccessProfileUseCase } from '@business/useCases/access/createAccessProfileUseCase'
import { IError } from '@shared/iError'
import { AccessProfileErrors } from '@business/modules/errors/access/accessProfileErrors'

describe('Create access profile operator', () => {
  const accessLevelAlreadyInUseError = AccessProfileErrors.accessProfileLevelAlreadyInUse()
  // const accessNotFoundError = AccessProfileErrors.accessProfileNotFound()
  const accessEntityCreationError = AccessProfileErrors.entityCreationError()

  beforeAll(() => {
    container
      .bind(IUniqueIdentifierServiceToken)
      .to(FakeUniqueIdentifierService)
    container.bind(IAccessProfileRepositoryToken).to(FakeAccessProfileRepository)
    container.bind(FindAccessProfileByUseCase).to(FindAccessProfileByUseCase)
    container.bind(CreateAccessProlfileOperator).to(CreateAccessProlfileOperator)
    container.bind(CreateAccessProfileUseCase).to(CreateAccessProfileUseCase)
  })

  afterAll(() => {
    container.unbindAll()
  })

  test('Should create a access profile', async () => {
    const inputCreateAccess = new InputCreateAccessProfile({
      level: 'admin'
    })

    fakeAccessProfileRepositoryCreate.mockImplementationOnce(async () => fakeAccessProfileEntity)
    const operator = container.get(CreateAccessProlfileOperator)
    const access = await operator.run(inputCreateAccess)
    expect(access.isLeft()).toBeFalsy()
    expect(access.isRight()).toBeTruthy()
    expect.assertions(2)
  })

  test('Should not create a access profile with invalid level', async () => {
    const inputCreateAccess = new InputCreateAccessProfile({
      level: 'a'
    })

    try {
      const operator = container.get(CreateAccessProlfileOperator)
      await operator.run(inputCreateAccess)
    } catch (error) {
      expect(error).toBeInstanceOf(IError)
    }
    expect.assertions(1)
  })

  test('Should not create a access profile with an already existent level', async () => {
    const inputCreateAccess = new InputCreateAccessProfile({
      level: 'admin'
    })

    fakeAccessProfileRepositoryFindBy.mockImplementation(async () => fakeAccessProfileEntity)
    const operator = container.get(CreateAccessProlfileOperator)

    const access = await operator.run(inputCreateAccess)

    expect(access.isLeft()).toBeTruthy()
    expect(access.isRight()).toBeFalsy()

    if (access.isLeft()) {
      expect(access.value.body).toStrictEqual(accessLevelAlreadyInUseError.body)
    }

    expect.assertions(3)
  })

  test('Should not create a access if access repository create method throws', async () => {
    const inputCreateAccessProfile = new InputCreateAccessProfile({
      level: 'admin'
    })

    fakeAccessProfileRepositoryCreate.mockImplementation(async () => {
      throw new Error()
    })
    fakeAccessProfileRepositoryFindBy.mockImplementation(async () => void 0)

    const operator = container.get(CreateAccessProlfileOperator)

    const access = await operator.run(inputCreateAccessProfile)

    expect(access.isLeft()).toBeTruthy()
    expect(access.isRight()).toBeFalsy()

    if (access.isLeft()) {
      expect(access.value.body).toStrictEqual(accessEntityCreationError.body)
    }

    expect.assertions(3)
  })
})
