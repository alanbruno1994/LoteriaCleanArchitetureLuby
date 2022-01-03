import { AccessProfileErrors } from '@business/modules/errors/access/accessProfileErrors'
import { IAccessProfileRepositoryToken } from '@business/repositories/accessprofile/iAccessProfileRepository'
import { FindAccessProfileByUseCase } from '@business/useCases/access/findAccessProfileByUseCase'
import { FindOneAccessProfileOperator } from '@controller/operations/access/findOneAccess'
import { InputByAccessProfile } from '@controller/serializers/access/inputByAccessProfile'
import { container } from '@shared/ioc/container'
import { fakeAccessProfileEntity } from '@tests/mock/fakes/entities/fakeAccessProfileEntity'
import { FakeAccessProfileRepository, fakeAccessProfileRepositoryFindBy } from '@tests/mock/fakes/repositories/fakeAccessRepository'

describe('Find one bet operator', () => {
  beforeAll(() => {
    container.bind(FindOneAccessProfileOperator).to(FindOneAccessProfileOperator)
    container.bind(FindAccessProfileByUseCase).to(FindAccessProfileByUseCase)
    container.bind(IAccessProfileRepositoryToken).to(FakeAccessProfileRepository)
  })

  afterAll(() => {
    container.unbindAll()
  })

  test('Should find a bet', async () => {
    const inputDeleteAccessProfile = new InputByAccessProfile({ secureId: '7b1f3001-6a4b-4bdd-90e9-8a280fff017d' })
    fakeAccessProfileRepositoryFindBy.mockImplementationOnce(
      async () => fakeAccessProfileEntity
    )

    const operator = container.get(FindOneAccessProfileOperator)
    const betId = await operator.run(inputDeleteAccessProfile)

    expect(betId.isLeft()).toBeFalsy()

    if (betId.isRight()) {
      expect(betId.value).toStrictEqual(fakeAccessProfileEntity)
    }

    expect.assertions(2)
  })

  test('Should returns error if findBy of bet returns void', async () => {
    const inputDeleteAccessProfile = new InputByAccessProfile({ secureId: '7b1f3001-6a4b-4bdd-90e9-8a280fff017d' })
    fakeAccessProfileRepositoryFindBy.mockImplementationOnce(
      // eslint-disable-next-line no-void
      async () => void 0
    )
    const operator = container.get(FindOneAccessProfileOperator)
    const betId = await operator.run(inputDeleteAccessProfile)

    expect(betId.isRight()).toBeFalsy()

    if (betId.isLeft()) {
      expect(betId.value.statusCode).toBe(
        AccessProfileErrors.accessProfileNotFound().statusCode
      )
      expect(betId.value.body).toStrictEqual(AccessProfileErrors.accessProfileNotFound().body)
    }
  })
})
