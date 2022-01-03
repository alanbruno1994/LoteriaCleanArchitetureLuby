import { UserErrors } from '@business/modules/errors/user/userErrors'
import { IUserRepositoryToken } from '@business/repositories/user/iUserRepository'
import { FindUserByUseCase } from '@business/useCases/user/findUserByUseCase'
import { FindOneUserOperator } from '@controller/operations/user/findOneUser'
import { InputByUser } from '@controller/serializers/user/inputByUser'
import { container } from '@shared/ioc/container'
import { fakeUserEntityPlayer } from '@tests/mock/fakes/entities/fakeUserEntity'
import { FakeUserRepository, fakeUserRepositoryFindBy } from '@tests/mock/fakes/repositories/fakeUserRepository'

describe('Find one user operator', () => {
  beforeAll(() => {
    container.bind(FindOneUserOperator).to(FindOneUserOperator)
    container.bind(FindUserByUseCase).to(FindUserByUseCase)
    container.bind(IUserRepositoryToken).to(FakeUserRepository)
  })

  afterAll(() => {
    container.unbindAll()
  })

  test('Should find a user', async () => {
    const inputDeleteUser = new InputByUser({ secureId: '7b1f3001-6a4b-4bdd-90e9-8a280fff017d' })
    fakeUserRepositoryFindBy.mockImplementationOnce(
      async () => fakeUserEntityPlayer
    )

    const operator = container.get(FindOneUserOperator)
    const userId = await operator.run(inputDeleteUser)

    expect(userId.isLeft()).toBeFalsy()

    if (userId.isRight()) {
      expect(userId.value).toStrictEqual(fakeUserEntityPlayer)
    }

    expect.assertions(2)
  })

  test('Should returns error if findBy of user returns void', async () => {
    const inputDeleteUser = new InputByUser({ secureId: '7b1f3001-6a4b-4bdd-90e9-8a280fff017d' })
    fakeUserRepositoryFindBy.mockImplementationOnce(
      // eslint-disable-next-line no-void
      async () => void 0
    )
    const operator = container.get(FindOneUserOperator)
    const userId = await operator.run(inputDeleteUser)

    expect(userId.isRight()).toBeFalsy()

    if (userId.isLeft()) {
      expect(userId.value.statusCode).toBe(
        UserErrors.userNotFound().statusCode
      )
      expect(userId.value.body).toStrictEqual(UserErrors.userNotFound().body)
    }
  })
})
