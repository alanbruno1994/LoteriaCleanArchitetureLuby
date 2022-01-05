import { BetErrors } from '@business/modules/errors/bet/betErrors'
import { IBetRepositoryToken } from '@business/repositories/bet/iBetRepository'
import { DeleteBetUseCase } from '@business/useCases/bet/deleteBetUseCase'
import { FindBetByUseCase } from '@business/useCases/bet/findBetByUseCase'
import { DeleteBetOperator } from '@controller/operations/bet/deleteBet'
import { InputDeleteBet } from '@controller/serializers/bet/inputDeleteBet'
import { container } from '@shared/ioc/container'
import { fakeBetEntity } from '@tests/mock/fakes/entities/fakeBetEntity'
import { FakeBetRepository, fakeBetRepositoryDelete, fakeBetRepositoryFindBy } from '@tests/mock/fakes/repositories/fakeBetRepository'

describe('Delete bet operator', () => {
  beforeAll(() => {
    container.bind(DeleteBetOperator).to(DeleteBetOperator)
    container.bind(FindBetByUseCase).to(FindBetByUseCase)
    container.bind(DeleteBetUseCase).to(DeleteBetUseCase)
    container.bind(IBetRepositoryToken).to(FakeBetRepository)
  })

  afterAll(() => {
    container.unbindAll()
  })

  test('Should delete a bet', async () => {
    const inputDeleteBet = new InputDeleteBet({ secure_id: '7b1f3001-6a4b-4bdd-90e9-8a280fff017d' })
    fakeBetRepositoryFindBy.mockImplementationOnce(
      async () => fakeBetEntity
    )

    fakeBetRepositoryDelete.mockImplementationOnce(
      async () => fakeBetEntity
    )

    const operator = container.get(DeleteBetOperator)
    const betId = await operator.run(inputDeleteBet)

    expect(betId.isLeft()).toBeFalsy()

    if (betId.isRight()) {
      expect(betId.value).toStrictEqual(fakeBetEntity)
    }

    expect.assertions(2)
  })

  test('Should returns error if findBy of bet returns void', async () => {
    const inputDeleteBet = new InputDeleteBet({ secure_id: '7b1f3001-6a4b-4bdd-90e9-8a280fff017d' })
    fakeBetRepositoryFindBy.mockImplementationOnce(
      // eslint-disable-next-line no-void
      async () => void 0
    )
    const operator = container.get(DeleteBetOperator)
    const betId = await operator.run(inputDeleteBet)

    expect(betId.isRight()).toBeFalsy()

    if (betId.isLeft()) {
      expect(betId.value.statusCode).toBe(
        BetErrors.betNotFound().statusCode
      )
      expect(betId.value.body).toStrictEqual(BetErrors.betNotFound().body)
    }
  })

  test('Should returns error if delete of bet return void', async () => {
    const inputDeleteBet = new InputDeleteBet({ secure_id: '7b1f3001-6a4b-4bdd-90e9-8a280fff017d' })
    fakeBetRepositoryFindBy.mockImplementationOnce(
      async () => fakeBetEntity
    )

    fakeBetRepositoryDelete.mockImplementationOnce(
      // eslint-disable-next-line no-void
      async () => void 0
    )

    const operator = container.get(DeleteBetOperator)
    const betId = await operator.run(inputDeleteBet)

    expect(betId.isRight()).toBeFalsy()

    if (betId.isLeft()) {
      expect(betId.value.statusCode).toBe(
        BetErrors.betFailedToDelete().statusCode
      )
      expect(betId.value.body).toStrictEqual(
        BetErrors.betFailedToDelete().body
      )
    }
  })
})
