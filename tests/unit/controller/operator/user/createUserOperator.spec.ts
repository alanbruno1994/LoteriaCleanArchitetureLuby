/* eslint-disable no-void */
import { container } from '@shared/ioc/container'
import { IUserRepositoryToken } from '@root/src/2-business/repositories/user/iUserRepository'
import { IHasherServiceToken } from '@root/src/2-business/services/hasher/iHasher'
import { IUniqueIdentifierServiceToken } from '@root/src/2-business/services/uniqueIdentifier/iUniqueIdentifier'
import { CreateUserUseCase } from '@root/src/2-business/useCases/user/createUserUseCase'
import {
  FakeUserRepository, fakeUserRepositoryCreate, fakeUserRepositoryFindBy
} from '@tests/mock/fakes/repositories/fakeUserRepository'
import { FakeHasherService } from '@tests/mock/fakes/services/fakeHasherService'
import { FakeUniqueIdentifierService } from '@tests/mock/fakes/services/fakeUniqueIdentifierService'
import { FindUserByUseCase } from '@root/src/2-business/useCases/user/findUserByUseCase'
import { FindAccessProfileByUseCase } from '@business/useCases/access/findAccessProfileByUseCase'
import { CreateUserAdminOperator } from '@controller/operations/user/createUserAdmin'
import { CreateUserPlayerOperator } from '@controller/operations/user/createUserPlayer'
import { FakeAccessProfileRepository, fakeAccessProfileRepositoryFindBy } from '@tests/mock/fakes/repositories/fakeAccessRepository'
import { fakeUserEntityAdmin, fakeUserEntityPlayer } from '@tests/mock/fakes/entities/fakeUserEntity'
import { InputCreateUser } from '@controller/serializers/user/inputCreateUser'
import { IAccessProfileRepositoryToken } from '@business/repositories/accessprofile/iAccessProfileRepository'
import { IError } from '@shared/iError'
import { UserErrors } from '@business/modules/errors/user/userErrors'
import { AccessProfileErrors } from '@business/modules/errors/access/accessProfileErrors'

describe('Create user operator', () => {
  const userEmailAlreadyInUseError = UserErrors.userEmailAlreadyInUse()
  const accessNotFoundError = AccessProfileErrors.accessProfileNotFound()
  const userEntityCreationError = UserErrors.entityCreationError()

  beforeAll(() => {
    container.bind(IHasherServiceToken).to(FakeHasherService)
    container.bind(IUserRepositoryToken).to(FakeUserRepository)
    container
      .bind(IUniqueIdentifierServiceToken)
      .to(FakeUniqueIdentifierService)
    container.bind(IAccessProfileRepositoryToken).to(FakeAccessProfileRepository)
    container.bind(CreateUserUseCase).to(CreateUserUseCase)
    container.bind(FindUserByUseCase).to(FindUserByUseCase)
    container.bind(FindAccessProfileByUseCase).to(FindAccessProfileByUseCase)
    container.bind(CreateUserAdminOperator).to(CreateUserAdminOperator)
    container.bind(CreateUserPlayerOperator).to(CreateUserPlayerOperator)
  })

  afterAll(() => {
    container.unbindAll()
  })

  test('Should create a user admin', async () => {
    const inputCreateUser = new InputCreateUser({
      email: 'fake@mail.com',
      name: 'Alan Bruno Rios Miguel',
      password: 'test_12345'
    })

    fakeUserRepositoryCreate.mockImplementationOnce(async () => fakeUserEntityAdmin)
    fakeAccessProfileRepositoryFindBy.mockImplementationOnce(async () => ({
      id: 1,
      level: 'admin',
      secure_id: '7ejss-wdjjd-wwkkd',
      created_at: new Date(),
      updated_at: new Date()
    }))
    const operator = container.get(CreateUserAdminOperator)
    const user = await operator.run(inputCreateUser)
    expect(user.isLeft()).toBeFalsy()
    expect(user.isRight()).toBeTruthy()
    if (user.isRight()) {
      expect(user.value.access_profile_id).toBe(1)
    }
    expect.assertions(3)
  })

  test('Should create a user player', async () => {
    const inputCreateUser = new InputCreateUser({
      email: 'fake@mail.com',
      name: 'Alan Bruno Rios Miguel',
      password: 'test_12345'
    })

    fakeUserRepositoryCreate.mockImplementationOnce(async () => fakeUserEntityPlayer)
    fakeAccessProfileRepositoryFindBy.mockImplementationOnce(async () => ({
      id: 2,
      level: 'player',
      secure_id: '7ejss-wdjjd-wwkkd',
      created_at: new Date(),
      updated_at: new Date()
    }))
    const operator = container.get(CreateUserPlayerOperator)
    const user = await operator.run(inputCreateUser)
    expect(user.isLeft()).toBeFalsy()
    expect(user.isRight()).toBeTruthy()
    if (user.isRight()) {
      expect(user.value.access_profile_id).toBe(2)
    }
    expect.assertions(3)
  })

  test('Should not create a user with invalid email', async () => {
    const inputCreateUser = new InputCreateUser({
      email: 'fakemail.com',
      name: 'Alan Bruno Rios Miguel',
      password: 'test_12345'
    })

    try {
      const operator = container.get(CreateUserAdminOperator)
      await operator.run(inputCreateUser)
    } catch (error) {
      expect(error).toBeInstanceOf(IError)
    }
    expect.assertions(1)
  })

  test('Should not create a user with invalid name', async () => {
    const inputCreateUser = new InputCreateUser({
      email: 'fakemail.com',
      name: 'Alan Bruno',
      password: 'test_12345'
    })

    try {
      const operator = container.get(CreateUserAdminOperator)
      await operator.run(inputCreateUser)
    } catch (error) {
      expect(error).toBeInstanceOf(IError)
    }
    expect.assertions(1)
  })

  test('Should not create a user with invalid password', async () => {
    const inputCreateUser = new InputCreateUser({
      email: 'fakemail.com',
      name: 'Alan Bruno Rios Miguel',
      password: 'a'
    })

    try {
      const operator = container.get(CreateUserAdminOperator)
      await operator.run(inputCreateUser)
    } catch (error) {
      expect(error).toBeInstanceOf(IError)
    }
    expect.assertions(1)
  })

  test('Should not create a user with an already existent e-mail', async () => {
    const inputCreateUser = new InputCreateUser({
      email: 'fake@mail.com',
      name: 'Alan Bruno Rios Miguel',
      password: 'test_12345'
    })

    fakeUserRepositoryFindBy.mockImplementation(async () => fakeUserEntityAdmin)
    const operator = container.get(CreateUserAdminOperator)

    const user = await operator.run(inputCreateUser)

    expect(user.isLeft()).toBeTruthy()
    expect(user.isRight()).toBeFalsy()

    if (user.isLeft()) {
      expect(user.value.body).toStrictEqual(userEmailAlreadyInUseError.body)
    }

    expect.assertions(3)
  })

  test('Should not create a user with an unexistent access profile', async () => {
    const inputCreateUser = new InputCreateUser({
      email: 'fake@mail.com',
      name: 'Alan Bruno Rios Miguel',
      password: 'test_12345'
    })

    fakeUserRepositoryFindBy.mockImplementation(async () => void 0)
    fakeAccessProfileRepositoryFindBy.mockImplementation(async () => void 0)

    const operator = container.get(CreateUserAdminOperator)

    const user = await operator.run(inputCreateUser)

    expect(user.isLeft()).toBeTruthy()
    expect(user.isRight()).toBeFalsy()

    if (user.isLeft()) {
      expect(user.value.body).toStrictEqual(accessNotFoundError.body)
    }

    expect.assertions(3)
  })

  test('Should not create a user if user repository create method throws', async () => {
    const inputCreateUser = new InputCreateUser({
      email: 'fake@mail.com',
      name: 'Alan Bruno Rios Miguel',
      password: 'test_12345'
    })

    fakeUserRepositoryCreate.mockImplementation(async () => {
      throw new Error()
    })
    fakeUserRepositoryFindBy.mockImplementation(async () => void 0)
    fakeAccessProfileRepositoryFindBy.mockImplementation(async () => ({
      id: 1,
      level: 'admin',
      secure_id: '7ejwr-dsskks-ddsa',
      created_at: new Date(),
      updated_at: new Date()
    }))

    const operator = container.get(CreateUserAdminOperator)

    const user = await operator.run(inputCreateUser)

    expect(user.isLeft()).toBeTruthy()
    expect(user.isRight()).toBeFalsy()

    if (user.isLeft()) {
      expect(user.value.body).toStrictEqual(userEntityCreationError.body)
    }

    expect.assertions(3)
  })
})
