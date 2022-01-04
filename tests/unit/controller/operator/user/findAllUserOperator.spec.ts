/* eslint-disable no-void */
import { UserErrors } from '@business/modules/errors/user/userErrors'
import { IUserRepositoryToken } from '@business/repositories/user/iUserRepository'
import { FindAllUsersUseCase } from '@business/useCases/user/findAllUsersUseCase'
import { FindAllUsersOperator } from '@controller/operations/user/findAllUsers'
import { container } from '@shared/ioc/container'
import { fakeUsersList } from '@tests/mock/fakes/entities/fakeUserEntity'
import { FakeUserRepository, fakeUserRepositoryFindAll } from '@tests/mock/fakes/repositories/fakeUserRepository'

describe('Find all users operator', () => {
  beforeAll(() => {
    container.bind(FindAllUsersUseCase).to(FindAllUsersUseCase)
    container.bind(FindAllUsersOperator).to(FindAllUsersOperator)
    container.bind(IUserRepositoryToken).to(FakeUserRepository)
  })

  afterAll(() => {
    container.unbindAll()
  })

  test('Should find all users', async () => {
    const operator = container.get(FindAllUsersOperator)
    fakeUserRepositoryFindAll.mockImplementationOnce(async () => (fakeUsersList))
    const users = await operator.run()

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
    const users = await operator.run()

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
