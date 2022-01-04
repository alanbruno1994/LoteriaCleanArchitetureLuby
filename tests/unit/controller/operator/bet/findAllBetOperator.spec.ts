/* eslint-disable no-void */
import { BetErrors } from '@business/modules/errors/bet/betErrors'
import { IBetRepositoryToken } from '@business/repositories/bet/iBetRepository'
import { FindAllBetsUseCase } from '@business/useCases/bet/findAllBetUseCase'
import { FindAllBetOperator } from '@controller/operations/bet/findAllBet'
import { container } from '@shared/ioc/container'
import { fakeBetsList } from '@tests/mock/fakes/entities/fakeBetEntity'
import { FakeBetRepository, fakeBetRepositoryFindAll } from '@tests/mock/fakes/repositories/fakeBetRepository'

describe('Find all bets operator', () => {
  beforeAll(() => {
    container.bind(FindAllBetsUseCase).to(FindAllBetsUseCase)
    container.bind(FindAllBetOperator).to(FindAllBetOperator)
    container.bind(IBetRepositoryToken).to(FakeBetRepository)
  })

  afterAll(() => {
    container.unbindAll()
  })

  test('Should find all bets', async () => {
    const operator = container.get(FindAllBetOperator)
    fakeBetRepositoryFindAll.mockImplementationOnce(async () => (fakeBetsList))
    const bets = await operator.run()

    expect(bets.isLeft()).toBeFalsy()

    if (bets.isRight()) {
      expect(bets.value.length).toBe(4)
      bets.value.forEach((bet, index) => {
        expect(bet).toHaveProperty('id') // testa se tem a propriedade id
        expect(bet.id).toBe(index + 1)
      })
    }

    expect.assertions(10)
  })

  test('Should returns error if bet repository return void', async () => {
    const operator = container.get(FindAllBetOperator)
    fakeBetRepositoryFindAll.mockImplementationOnce(async () => void 0)
    const bets = await operator.run()

    expect(bets.isRight()).toBeFalsy()

    if (bets.isLeft()) {
      expect(bets.value.statusCode).toBe(
        BetErrors.betNotLoadedCorrectly().statusCode
      )
      expect(bets.value.body).toStrictEqual(
        BetErrors.betNotLoadedCorrectly().body
      )
    }

    expect.assertions(3)
  })
})
