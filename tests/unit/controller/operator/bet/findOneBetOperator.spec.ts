import { BetErrors } from '@business/modules/errors/bet/betErrors'
import { IBetRepositoryToken } from '@business/repositories/bet/iBetRepository'
import { FindBetByUseCase } from '@business/useCases/bet/findBetByUseCase'
import { FindOneBetOperator } from '@controller/operations/bet/findOneBet'
import { InputByBet } from '@controller/serializers/bet/inputByBet'
import { container } from '@shared/ioc/container'
import { fakeBetEntity } from '@tests/mock/fakes/entities/fakeBetEntity'
import { FakeBetRepository, fakeBetRepositoryFindBy } from '@tests/mock/fakes/repositories/fakeBetRepository'

describe('Find one bet operator', () => {
  beforeAll(() => {
    container.bind(FindOneBetOperator).to(FindOneBetOperator)
    container.bind(FindBetByUseCase).to(FindBetByUseCase)
    container.bind(IBetRepositoryToken).to(FakeBetRepository)
  })

  afterAll(() => {
    container.unbindAll()
  })

  test('Should find a bet', async () => {
    const inputDeleteBet = new InputByBet({ secureId: '7b1f3001-6a4b-4bdd-90e9-8a280fff017d' })
    fakeBetRepositoryFindBy.mockImplementationOnce(
      async () => fakeBetEntity
    )

    const operator = container.get(FindOneBetOperator)
    const betId = await operator.run(inputDeleteBet)

    expect(betId.isLeft()).toBeFalsy()

    if (betId.isRight()) {
      expect(betId.value).toStrictEqual(fakeBetEntity)
    }

    expect.assertions(2)
  })

  test('Should returns error if findBy of bet returns void', async () => {
    const inputDeleteBet = new InputByBet({ secureId: '7b1f3001-6a4b-4bdd-90e9-8a280fff017d' })
    fakeBetRepositoryFindBy.mockImplementationOnce(
      // eslint-disable-next-line no-void
      async () => void 0
    )
    const operator = container.get(FindOneBetOperator)
    const betId = await operator.run(inputDeleteBet)

    expect(betId.isRight()).toBeFalsy()

    if (betId.isLeft()) {
      expect(betId.value.statusCode).toBe(
        BetErrors.betNotFound().statusCode
      )
      expect(betId.value.body).toStrictEqual(BetErrors.betNotFound().body)
    }
  })
})
