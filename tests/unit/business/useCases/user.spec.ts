/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable no-void */
// Make sure that container is first called, reflect-metada is important for decorators which are used in subsequent imports
import { UserErrors } from '@business/modules/errors/user/userErrors'
import { IUserRepositoryToken } from '@business/repositories/user/iUserRepository'
import { IHasherServiceToken } from '@business/services/hasher/iHasher'
import { IUniqueIdentifierServiceToken } from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import { CreateUserUseCase } from '@business/useCases/user/createUserUseCase'
import { DeleteUserUseCase } from '@business/useCases/user/deleteUserUseCase'
import { FindAllUsersUseCase } from '@business/useCases/user/findAllUsersUseCase'
import { FindUserByUseCase } from '@business/useCases/user/findUserByUseCase'
import { UpdateUserUseCase } from '@business/useCases/user/updateUserUseCase'
import { container } from '@shared/ioc/container'
import { fakeNewUser, fakeUserEntityAdmin, fakeUsersList } from '@tests/mock/fakes/entities/fakeUserEntity'
import { FakeUserRepository, fakeUserRepositoryDelete, fakeUserRepositoryFindAll, fakeUserRepositoryFindBy } from '@tests/mock/fakes/repositories/fakeUserRepository'
import { FakeHasherService, fakeHasherServiceCreate } from '@tests/mock/fakes/services/fakeHasherService'
import { FakeUniqueIdentifierService } from '@tests/mock/fakes/services/fakeUniqueIdentifierService'

describe('User use cases', () => {
  jest.spyOn(console, 'error').mockImplementation(() => ({}))

  const createUserError = UserErrors.entityCreationError()
  const userNotFoundError = UserErrors.userNotFound()

  beforeAll(() => {
    container.bind(CreateUserUseCase).to(CreateUserUseCase)
    container.bind(FindUserByUseCase).to(FindUserByUseCase)
    container.bind(FindAllUsersUseCase).to(FindAllUsersUseCase)
    container.bind(UpdateUserUseCase).to(UpdateUserUseCase)
    container.bind(DeleteUserUseCase).to(DeleteUserUseCase)
    container.bind(IHasherServiceToken).to(FakeHasherService)
    container.bind(IUserRepositoryToken).to(FakeUserRepository)
    container
      .bind(IUniqueIdentifierServiceToken)
      .to(FakeUniqueIdentifierService)
  })

  afterAll(() => {
    container.unbindAll()
  })

  describe('CreateUser', () => {
    // Aqui esta mocando para alterar o comportamento do metodo create
    const mockRepositoryCreateUser = jest.spyOn(
      FakeUserRepository.prototype,
      'create'
    )
    test('Should create an user', async () => {
      const operator = container.get(CreateUserUseCase)
      const userEntity = await operator.exec(fakeNewUser)

      expect(userEntity.isLeft()).toBeFalsy()
      expect(userEntity.isRight()).toBeTruthy()

      if (userEntity.isRight()) {
        expect(userEntity.value.email).toBe(fakeNewUser.email)
        expect(userEntity.value.name).toBe(fakeNewUser.name)
      }

      expect.assertions(4)
    })

    test('Should throw an error if repository fails in its process', async () => {
      const operator = container.get(CreateUserUseCase)
      // Altera o comportamento para gerar um error
      mockRepositoryCreateUser.mockImplementation(() => {
        throw new Error()
      })
      const userEntity = await operator.exec(fakeNewUser)

      expect(userEntity.isLeft()).toBeTruthy()
      expect(userEntity.isRight()).toBeFalsy()

      if (userEntity.isLeft()) {
        expect(userEntity.value.statusCode).toBe(createUserError.statusCode)
        expect(userEntity.value.body).toStrictEqual(createUserError.body)
      }

      expect.assertions(4)
    })
  })

  describe('FindUserBy', () => {
    test('Should return user if it exists', async () => {
      const userFindByUseCase = container.get(FindUserByUseCase)

      fakeUserRepositoryFindBy.mockImplementation(async () => fakeUserEntityAdmin)

      const userResult = await userFindByUseCase.exec({
        key: 'email',
        value: fakeUserEntityAdmin.email
      })

      expect(userResult.isLeft()).toBeFalsy()
      expect(userResult.isRight()).toBeTruthy()
    })

    test('Should not find user if it does not exists', async () => {
      const userRepository = container.get(FindUserByUseCase)

      fakeUserRepositoryFindBy.mockImplementation(async () => void 0)

      const userResult = await userRepository.exec({
        key: 'email',
        value: 'nonexistent@email.com'
      })

      expect(userResult.isLeft()).toBeTruthy()
      expect(userResult.isRight()).toBeFalsy()

      if (userResult.isLeft()) {
        expect(userResult.value.statusCode).toBe(userNotFoundError.statusCode)
        expect(userResult.value.body).toStrictEqual(userNotFoundError.body)
      }

      expect.assertions(4)
    })
  })

  describe('updateUser', () => {
    const mockUserUpdate = jest.spyOn(FakeUserRepository.prototype, 'update')

    test('Should return user updated if repository.update returns user', async () => {
      const updateRepository = container.get(UpdateUserUseCase)
      mockUserUpdate.mockImplementationOnce(async () => fakeUserEntityAdmin)
      const userUpdated = await updateRepository.exec(fakeUserEntityAdmin, {
        column: 'id',
        value: ''
      })
      expect(userUpdated.isLeft()).toBeFalsy()

      if (userUpdated.isRight()) {
        expect(userUpdated.value.updated_at).not.toBe(fakeUserEntityAdmin.updated_at)
      }

      expect.assertions(2)
    })

    test('Should throws user not found error if repository.update returns void', async () => {
      const updateRepository = container.get(UpdateUserUseCase)
      const userUpdated = await updateRepository.exec(fakeUserEntityAdmin, {
        column: 'id',
        value: ''
      })
      expect(userUpdated.isRight()).toBeFalsy()

      if (userUpdated.isLeft()) {
        expect(userUpdated.value.statusCode).toBe(
          UserErrors.userNotFound().statusCode
        )
        expect(userUpdated.value.body).toStrictEqual(
          UserErrors.userNotFound().body
        )
      }

      expect.assertions(3)
    })

    test('Should throws user not found error if repository.update returns void', async () => {
      const updateRepository = container.get(UpdateUserUseCase)

      mockUserUpdate.mockImplementationOnce(async () => {
        throw new Error()
      })

      const userUpdated = await updateRepository.exec(fakeUserEntityAdmin, {
        column: 'id',
        value: ''
      })
      expect(userUpdated.isRight()).toBeFalsy()

      if (userUpdated.isLeft()) {
        expect(userUpdated.value.statusCode).toBe(
          UserErrors.userFailedToUpdate().statusCode
        )
        expect(userUpdated.value.body).toStrictEqual(
          UserErrors.userFailedToUpdate().body
        )
      }

      expect.assertions(3)
    })

    test('Should not update user password if its undefined', async () => {
      const updateRepository = container.get(UpdateUserUseCase)
      mockUserUpdate.mockImplementationOnce(async () => fakeUserEntityAdmin)

      const createHash = jest.fn()

      fakeHasherServiceCreate.mockImplementation(createHash)

      const userUpdated = await updateRepository.exec(
        { ...fakeUserEntityAdmin, password: undefined },
        {
          column: 'id',
          value: ''
        }
      )
      expect(userUpdated.isLeft()).toBeFalsy()
      expect(createHash).not.toHaveBeenCalled()
    })

    test('Should hash user password if its truthy', async () => {
      const updateRepository = container.get(UpdateUserUseCase)
      mockUserUpdate.mockImplementationOnce(async () => fakeUserEntityAdmin)

      const createHash = jest.fn()

      fakeHasherServiceCreate.mockImplementation(createHash)

      const userUpdated = await updateRepository.exec(
        { ...fakeUserEntityAdmin, password: 'newPassword' },
        {
          column: 'id',
          value: ''
        }
      )
      expect(userUpdated.isLeft()).toBeFalsy()
      expect(createHash).toHaveBeenCalled()
    })
  })

  describe('Delete user use case', () => {
    test('Should delete a user', async () => {
      const operator = container.get(DeleteUserUseCase)
      fakeUserRepositoryDelete.mockImplementationOnce(
        async () => fakeUserEntityAdmin
      )

      const deletedRole = await operator.exec({
        key: 'id',
        value: fakeUserEntityAdmin.id
      })

      expect(deletedRole.isLeft()).toBeFalsy()
      if (deletedRole.isRight()) {
        expect(deletedRole.value).toStrictEqual(fakeUserEntityAdmin)
      }

      expect.assertions(2)
    })

    test('Should returns error if repository return void', async () => {
      const operator = container.get(DeleteUserUseCase)

      const deletedUser = await operator.exec({
        key: 'id',
        value: fakeUserEntityAdmin.id
      })

      expect(deletedUser.isRight()).toBeFalsy()
      if (deletedUser.isLeft()) {
        expect(deletedUser.value.statusCode).toBe(
          UserErrors.userFailedToDelete().statusCode
        )
        expect(deletedUser.value.body).toStrictEqual(
          UserErrors.userFailedToDelete().body
        )
      }

      expect.assertions(3)
    })
  })

  describe('Find all user use case', () => {
    test('Should returns all users', async () => {
      const useCase = container.get(FindAllUsersUseCase)
      fakeUserRepositoryFindAll.mockImplementationOnce(async () => fakeUsersList)
      const usersFound = await useCase.exec({ all: false })

      expect(usersFound.isLeft()).toBeFalsy()
      if (usersFound.isRight()) {
        expect(usersFound.value.length).toBe(4)
      }
      expect.assertions(2)
    })

    test('Should returns all users if not exists users', async () => {
      const useCase = container.get(FindAllUsersUseCase)
      const rolesFound = await useCase.exec({ all: false })
      expect(rolesFound.isRight()).toBeTruthy()
      expect.assertions(1)
    })

    test('Should returns error if repository return undefined', async () => {
      const useCase = container.get(FindAllUsersUseCase)
      fakeUserRepositoryFindAll.mockImplementationOnce(async () => void 0)
      const rolesFound = await useCase.exec({ all: false })
      expect(rolesFound.isRight()).toBeFalsy()
      if (rolesFound.isLeft()) {
        expect(rolesFound.value.statusCode).toBe(
          UserErrors.userNotLoadedCorrectly().statusCode
        )
        expect(rolesFound.value.body).toStrictEqual(
          UserErrors.userNotLoadedCorrectly().body
        )
      }
      expect.assertions(3)
    })
  })
})
