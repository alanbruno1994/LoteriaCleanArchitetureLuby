import { UserErrors } from '@business/modules/errors/user/userErrors'
import { IUserRepositoryToken } from '@business/repositories/user/iUserRepository'
import { IHasherServiceToken } from '@business/services/hasher/iHasher'
import { FindUserByUseCase } from '@business/useCases/user/findUserByUseCase'
import { UpdateUserUseCase } from '@business/useCases/user/updateUserUseCase'
import { UpdateUserOperator } from '@controller/operations/user/updateUser'
import { InputUpdateUser } from '@controller/serializers/user/inputUpdateUser'
import { IError } from '@shared/iError'
import { container } from '@shared/ioc/container'
import { fakeCreatedUserEntity, fakeUserEntityPlayer } from '@tests/mock/fakes/entities/fakeUserEntity'
import { FakeUserRepository, fakeUserRepositoryFindBy, fakeUserRepositoryUpdate } from '@tests/mock/fakes/repositories/fakeUserRepository'
import { FakeHasherService } from '@tests/mock/fakes/services/fakeHasherService'

describe('Update user operator', () => {
  beforeAll(() => {
    container.bind(IUserRepositoryToken).to(FakeUserRepository)
    container.bind(UpdateUserOperator).to(UpdateUserOperator)
    container.bind(FindUserByUseCase).to(FindUserByUseCase)
    container.bind(UpdateUserUseCase).to(UpdateUserUseCase)
    container.bind(IHasherServiceToken).to(FakeHasherService)
  })

  afterAll(() => {
    container.unbindAll()
  })

  test('Should update a user', async () => {
    const inputUpdateUser = new InputUpdateUser(fakeCreatedUserEntity)
    const operator = container.get(UpdateUserOperator)
    fakeUserRepositoryFindBy.mockImplementationOnce(
      async () => fakeUserEntityPlayer
    )
    fakeUserRepositoryUpdate.mockImplementation(async () => ({ ...fakeUserEntityPlayer, ...fakeCreatedUserEntity }))

    const user = await operator.run(inputUpdateUser, '7b1f3001-6a4b-4bdd-90e9-8a280fff017d')

    expect(user.isLeft()).toBeFalsy()

    if (user.isRight()) {
      expect(user.value.name).toBe('alan bruno rios miguel')
    }

    expect.assertions(2)
  })

  test('Should returns error if user not found', async () => {
    const inputUpdateUser = new InputUpdateUser(fakeCreatedUserEntity)
    const operator = container.get(UpdateUserOperator)
    fakeUserRepositoryFindBy.mockImplementationOnce(
      // eslint-disable-next-line no-void
      async () => void 0
    )
    const user = await operator.run(inputUpdateUser, '7b1f3001-6a4b-4bdd-90e9-8a280fff017d')

    expect(user.isRight()).toBeFalsy()

    if (user.isLeft()) {
      expect(user.value.statusCode).toBe(UserErrors.userNotFound().statusCode)
      expect(user.value.body).toStrictEqual(UserErrors.userNotFound().body)
    }

    expect.assertions(3)
  })

  test('Should not update a user with invalid email', async () => {
    const inputUpdateUser = new InputUpdateUser({
      email: 'fakemailgmail.com',
      name: 'Alan Bruno Rios Miguel',
      password: 'test_12345'
    })

    try {
      const operator = container.get(UpdateUserOperator)
      await operator.run(inputUpdateUser, '7b1f3001-6a4b-4bdd-90e9-8a280fff017d')
    } catch (error) {
      expect(error).toBeInstanceOf(IError)
    }
    expect.assertions(1)
  })

  test('Should not update a user with invalid name', async () => {
    const inputUpdateUser = new InputUpdateUser({
      email: 'fakemail@gmail.com',
      name: 'Alan',
      password: 'test_12345'
    })

    try {
      const operator = container.get(UpdateUserOperator)
      await operator.run(inputUpdateUser, '7b1f3001-6a4b-4bdd-90e9-8a280fff017d')
    } catch (error) {
      expect(error).toBeInstanceOf(IError)
    }
    expect.assertions(1)
  })

  test('Should not update a user with invalid password', async () => {
    const inputUpdateUser = new InputUpdateUser({
      email: 'fakemail@gmail.com',
      name: 'Alan Bruno Rios Miguel',
      password: ''
    })

    try {
      const operator = container.get(UpdateUserOperator)
      await operator.run(inputUpdateUser, '7b1f3001-6a4b-4bdd-90e9-8a280fff017d')
    } catch (error) {
      expect(error).toBeInstanceOf(IError)
    }
    expect.assertions(1)
  })
})
