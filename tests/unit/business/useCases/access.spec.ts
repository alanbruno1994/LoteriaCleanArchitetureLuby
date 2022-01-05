/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable no-void */
// Make sure that container is first called, reflect-metada is important for decorators which are used in subsequent imports
import { AccessProfileErrors } from '@business/modules/errors/access/accessProfileErrors'
import { IAccessProfileRepositoryToken } from '@business/repositories/accessprofile/iAccessProfileRepository'
import { IUniqueIdentifierServiceToken } from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import { CreateAccessProfileUseCase } from '@business/useCases/access/createAccessProfileUseCase'
import { DeleteAccessProfileUseCase } from '@business/useCases/access/deleteAccessProfileUseCase'
import { FindAccessProfileByUseCase } from '@business/useCases/access/findAccessProfileByUseCase'
import { FindAllAccessProfileUseCase } from '@business/useCases/access/findAllAccessProfileUseCase'
import { UpdateAccessProfileUseCase } from '@business/useCases/access/updateAccessProfileUseCase'
import { container } from '@shared/ioc/container'
import { fakeAccessProfileEntity, fakeAccessProfileList, fakeNewAccessProfile } from '@tests/mock/fakes/entities/fakeAccessProfileEntity'
import { FakeAccessProfileRepository, fakeAccessProfileRepositoryDelete, fakeAccessProfileRepositoryFindAll, fakeAccessProfileRepositoryFindBy } from '@tests/mock/fakes/repositories/fakeAccessRepository'
import { FakeUniqueIdentifierService } from '@tests/mock/fakes/services/fakeUniqueIdentifierService'

describe('AccessProfile use cases', () => {
  jest.spyOn(console, 'error').mockImplementation(() => ({}))

  const createAccessProfileError = AccessProfileErrors.entityCreationError()
  const accessNotFoundError = AccessProfileErrors.accessProfileNotFound()

  beforeAll(() => {
    container.bind(CreateAccessProfileUseCase).to(CreateAccessProfileUseCase)
    container.bind(FindAccessProfileByUseCase).to(FindAccessProfileByUseCase)
    container.bind(FindAllAccessProfileUseCase).to(FindAllAccessProfileUseCase)
    container.bind(UpdateAccessProfileUseCase).to(UpdateAccessProfileUseCase)
    container.bind(DeleteAccessProfileUseCase).to(DeleteAccessProfileUseCase)
    container.bind(IAccessProfileRepositoryToken).to(FakeAccessProfileRepository)
    container
      .bind(IUniqueIdentifierServiceToken)
      .to(FakeUniqueIdentifierService)
  })

  afterAll(() => {
    container.unbindAll()
  })

  describe('CreateAccessProfile', () => {
    // Aqui esta mocando para alterar o comportamento do metodo create
    const mockRepositoryCreateAccessProfile = jest.spyOn(
      FakeAccessProfileRepository.prototype,
      'create'
    )
    test('Should create an access', async () => {
      const operator = container.get(CreateAccessProfileUseCase)
      const accessEntity = await operator.exec(fakeNewAccessProfile)

      expect(accessEntity.isLeft()).toBeFalsy()
      expect(accessEntity.isRight()).toBeTruthy()

      if (accessEntity.isRight()) {
        expect(accessEntity.value.level).toBe(fakeNewAccessProfile.level)
      }

      expect.assertions(3)
    })

    test('Should throw an error if repository fails in its process', async () => {
      const operator = container.get(CreateAccessProfileUseCase)
      // Altera o comportamento para gerar um error
      mockRepositoryCreateAccessProfile.mockImplementation(() => {
        throw new Error()
      })
      const accessEntity = await operator.exec(fakeNewAccessProfile)

      expect(accessEntity.isLeft()).toBeTruthy()
      expect(accessEntity.isRight()).toBeFalsy()

      if (accessEntity.isLeft()) {
        expect(accessEntity.value.statusCode).toBe(createAccessProfileError.statusCode)
        expect(accessEntity.value.body).toStrictEqual(createAccessProfileError.body)
      }

      expect.assertions(4)
    })
  })

  describe('FindAccessProfileBy', () => {
    test('Should return access if it exists', async () => {
      const accessFindByUseCase = container.get(FindAccessProfileByUseCase)

      fakeAccessProfileRepositoryFindBy.mockImplementation(async () => fakeAccessProfileEntity)

      const accessResult = await accessFindByUseCase.exec({
        key: 'secure_id',
        value: fakeAccessProfileEntity.secure_id
      })

      expect(accessResult.isLeft()).toBeFalsy()
      expect(accessResult.isRight()).toBeTruthy()
    })

    test('Should not find access if it does not exists', async () => {
      const accessRepository = container.get(FindAccessProfileByUseCase)

      fakeAccessProfileRepositoryFindBy.mockImplementation(async () => void 0)

      const accessResult = await accessRepository.exec({
        key: 'secure_id',
        value: 'Not exists'
      })

      expect(accessResult.isLeft()).toBeTruthy()
      expect(accessResult.isRight()).toBeFalsy()

      if (accessResult.isLeft()) {
        expect(accessResult.value.statusCode).toBe(accessNotFoundError.statusCode)
        expect(accessResult.value.body).toStrictEqual(accessNotFoundError.body)
      }

      expect.assertions(4)
    })
  })

  describe('updateAccessProfile', () => {
    const mockAccessProfileUpdate = jest.spyOn(FakeAccessProfileRepository.prototype, 'update')

    test('Should return access updated if repository.update returns access', async () => {
      const updateRepository = container.get(UpdateAccessProfileUseCase)
      mockAccessProfileUpdate.mockImplementationOnce(async () => fakeAccessProfileEntity)
      const accessUpdated = await updateRepository.exec(fakeAccessProfileEntity, {
        column: 'id',
        value: ''
      })
      expect(accessUpdated.isLeft()).toBeFalsy()

      if (accessUpdated.isRight()) {
        expect(accessUpdated.value.updated_at).not.toBe(fakeAccessProfileEntity.updated_at)
      }

      expect.assertions(2)
    })

    test('Should throws access not found error if repository.update returns void', async () => {
      const updateRepository = container.get(UpdateAccessProfileUseCase)
      const accessUpdated = await updateRepository.exec(fakeAccessProfileEntity, {
        column: 'id',
        value: ''
      })
      expect(accessUpdated.isRight()).toBeFalsy()

      if (accessUpdated.isLeft()) {
        expect(accessUpdated.value.statusCode).toBe(
          AccessProfileErrors.accessProfileNotFound().statusCode
        )
        expect(accessUpdated.value.body).toStrictEqual(
          AccessProfileErrors.accessProfileNotFound().body
        )
      }

      expect.assertions(3)
    })

    test('Should throws access not found error if repository.update returns void', async () => {
      const updateRepository = container.get(UpdateAccessProfileUseCase)

      mockAccessProfileUpdate.mockImplementationOnce(async () => {
        throw new Error()
      })

      const accessUpdated = await updateRepository.exec(fakeAccessProfileEntity, {
        column: 'id',
        value: ''
      })
      expect(accessUpdated.isRight()).toBeFalsy()

      if (accessUpdated.isLeft()) {
        expect(accessUpdated.value.statusCode).toBe(
          AccessProfileErrors.accessProfileFailedToUpdate().statusCode
        )
        expect(accessUpdated.value.body).toStrictEqual(
          AccessProfileErrors.accessProfileFailedToUpdate().body
        )
      }

      expect.assertions(3)
    })
  })

  describe('Delete access use case', () => {
    test('Should delete a access', async () => {
      const operator = container.get(DeleteAccessProfileUseCase)
      fakeAccessProfileRepositoryDelete.mockImplementationOnce(
        async () => fakeAccessProfileEntity
      )

      const deletedRole = await operator.exec({
        key: 'id',
        value: fakeAccessProfileEntity.id
      })

      expect(deletedRole.isLeft()).toBeFalsy()
      if (deletedRole.isRight()) {
        expect(deletedRole.value).toStrictEqual(fakeAccessProfileEntity)
      }

      expect.assertions(2)
    })

    test('Should returns error if repository return void', async () => {
      const operator = container.get(DeleteAccessProfileUseCase)

      const deletedAccessProfile = await operator.exec({
        key: 'id',
        value: fakeAccessProfileEntity.id
      })

      expect(deletedAccessProfile.isRight()).toBeFalsy()
      if (deletedAccessProfile.isLeft()) {
        expect(deletedAccessProfile.value.statusCode).toBe(
          AccessProfileErrors.accessProfileFailedToDelete().statusCode
        )
        expect(deletedAccessProfile.value.body).toStrictEqual(
          AccessProfileErrors.accessProfileFailedToDelete().body
        )
      }

      expect.assertions(3)
    })
  })

  describe('Find all access use case', () => {
    test('Should returns all accesss', async () => {
      const useCase = container.get(FindAllAccessProfileUseCase)
      fakeAccessProfileRepositoryFindAll.mockImplementationOnce(async () => fakeAccessProfileList)
      const accesssFound = await useCase.exec()

      expect(accesssFound.isLeft()).toBeFalsy()
      if (accesssFound.isRight()) {
        expect(accesssFound.value.length).toBe(4)
      }
      expect.assertions(2)
    })

    test('Should returns all accesss if not exists accesss', async () => {
      const useCase = container.get(FindAllAccessProfileUseCase)
      const rolesFound = await useCase.exec()
      expect(rolesFound.isRight()).toBeTruthy()
      expect.assertions(1)
    })

    test('Should returns error if repository return undefined', async () => {
      const useCase = container.get(FindAllAccessProfileUseCase)
      fakeAccessProfileRepositoryFindAll.mockImplementationOnce(async () => void 0)
      const rolesFound = await useCase.exec()
      expect(rolesFound.isRight()).toBeFalsy()
      if (rolesFound.isLeft()) {
        expect(rolesFound.value.statusCode).toBe(
          AccessProfileErrors.accessProfileNotLoadedCorrectly().statusCode
        )
        expect(rolesFound.value.body).toStrictEqual(
          AccessProfileErrors.accessProfileNotLoadedCorrectly().body
        )
      }
      expect.assertions(3)
    })
  })
})
