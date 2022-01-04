/* eslint-disable no-void */
import { AccessProfileErrors } from '@business/modules/errors/access/accessProfileErrors'
import { IAccessProfileRepositoryToken } from '@business/repositories/accessprofile/iAccessProfileRepository'
import { FindAllAccessProfileUseCase } from '@business/useCases/access/findAllAccessProfileUseCase'
import { FindAllAccessProfileOperator } from '@controller/operations/access/findAllAccess'
import { container } from '@shared/ioc/container'
import { fakeAccessProfileList } from '@tests/mock/fakes/entities/fakeAccessProfileEntity'
import { FakeAccessProfileRepository, fakeAccessProfileRepositoryFindAll } from '@tests/mock/fakes/repositories/fakeAccessRepository'

describe('Find all accesses operator', () => {
  beforeAll(() => {
    container.bind(FindAllAccessProfileUseCase).to(FindAllAccessProfileUseCase)
    container.bind(FindAllAccessProfileOperator).to(FindAllAccessProfileOperator)
    container.bind(IAccessProfileRepositoryToken).to(FakeAccessProfileRepository)
  })

  afterAll(() => {
    container.unbindAll()
  })

  test('Should find all accesses', async () => {
    const operator = container.get(FindAllAccessProfileOperator)
    fakeAccessProfileRepositoryFindAll.mockImplementationOnce(async () => (fakeAccessProfileList))
    const accesses = await operator.run()

    expect(accesses.isLeft()).toBeFalsy()

    if (accesses.isRight()) {
      expect(accesses.value.length).toBe(4)
      accesses.value.forEach((bet, index) => {
        expect(bet).toHaveProperty('id') // testa se tem a propriedade id
        expect(bet.id).toBe(index + 1)
      })
    }

    expect.assertions(10)
  })

  test('Should returns error if acesss profile repository return void', async () => {
    const operator = container.get(FindAllAccessProfileOperator)
    fakeAccessProfileRepositoryFindAll.mockImplementationOnce(async () => void 0)
    const accesses = await operator.run()

    expect(accesses.isRight()).toBeFalsy()

    if (accesses.isLeft()) {
      expect(accesses.value.statusCode).toBe(
        AccessProfileErrors.accessProfileNotLoadedCorrectly().statusCode
      )
      expect(accesses.value.body).toStrictEqual(
        AccessProfileErrors.accessProfileNotLoadedCorrectly().body
      )
    }

    expect.assertions(3)
  })
})
