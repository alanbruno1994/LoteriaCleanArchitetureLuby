/* eslint-disable @typescript-eslint/naming-convention */
import { UserErrors } from '@business/modules/errors/user/userErrors'
import { IUserRepositoryToken } from '@business/repositories/user/iUserRepository'
import { DeleteUserUseCase } from '@business/useCases/user/deleteUserUseCase'
import { FindUserByUseCase } from '@business/useCases/user/findUserByUseCase'
import { DeleteUserOperator } from '@controller/operations/user/deleteUser'
import { InputDeleteUser } from '@controller/serializers/user/inputDeleteUser'
import { container } from '@shared/ioc/container'
import { fakeUserEntityPlayer } from '@tests/mock/fakes/entities/fakeUserEntity'
import { FakeUserRepository, fakeUserRepositoryDelete, fakeUserRepositoryFindBy } from '@tests/mock/fakes/repositories/fakeUserRepository'

describe('Delete user operator', () => {
  beforeAll(() => {
    container.bind(DeleteUserOperator).to(DeleteUserOperator)
    container.bind(FindUserByUseCase).to(FindUserByUseCase)
    container.bind(DeleteUserUseCase).to(DeleteUserUseCase)
    container.bind(IUserRepositoryToken).to(FakeUserRepository)
  })

  afterAll(() => {
    container.unbindAll()
  })

  test('Should delete a user', async () => {
    const inputDeleteUser = new InputDeleteUser({ secure_id: '7b1f3001-6a4b-4bdd-90e9-8a280fff017d' })
    fakeUserRepositoryFindBy.mockImplementationOnce(
      async () => fakeUserEntityPlayer
    )

    fakeUserRepositoryDelete.mockImplementationOnce(
      async () => fakeUserEntityPlayer
    )

    const operator = container.get(DeleteUserOperator)
    const user_id = await operator.run(inputDeleteUser)

    expect(user_id.isLeft()).toBeFalsy()

    if (user_id.isRight()) {
      expect(user_id.value).toStrictEqual(fakeUserEntityPlayer)
    }

    expect.assertions(2)
  })

  test('Should returns error if findBy of user returns void', async () => {
    const inputDeleteUser = new InputDeleteUser({ secure_id: '7b1f3001-6a4b-4bdd-90e9-8a280fff017d' })
    fakeUserRepositoryFindBy.mockImplementationOnce(
      // eslint-disable-next-line no-void
      async () => void 0
    )
    const operator = container.get(DeleteUserOperator)
    const user_id = await operator.run(inputDeleteUser)

    expect(user_id.isRight()).toBeFalsy()

    if (user_id.isLeft()) {
      expect(user_id.value.statusCode).toBe(
        UserErrors.userNotFound().statusCode
      )
      expect(user_id.value.body).toStrictEqual(UserErrors.userNotFound().body)
    }
  })

  test('Should returns error if delete of user return void', async () => {
    const inputDeleteUser = new InputDeleteUser({ secure_id: '7b1f3001-6a4b-4bdd-90e9-8a280fff017d' })
    fakeUserRepositoryFindBy.mockImplementationOnce(
      async () => fakeUserEntityPlayer
    )

    fakeUserRepositoryDelete.mockImplementationOnce(
      // eslint-disable-next-line no-void
      async () => void 0
    )

    const operator = container.get(DeleteUserOperator)
    const user_id = await operator.run(inputDeleteUser)

    expect(user_id.isRight()).toBeFalsy()

    if (user_id.isLeft()) {
      expect(user_id.value.statusCode).toBe(
        UserErrors.userFailedToDelete().statusCode
      )
      expect(user_id.value.body).toStrictEqual(
        UserErrors.userFailedToDelete().body
      )
    }
  })
})
