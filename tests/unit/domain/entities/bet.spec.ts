import { BetEntity } from '@domain/entities/betEntity'
import { fakeCreatedBetEntity } from '@tests/mock/fakes/entities/fakeBetEntity'

describe('Bet entity', () => {
  describe('Create method', () => {
    test('Should create a bet entity', () => {
      const bet = BetEntity.create(fakeCreatedBetEntity)
      // testa se dado montado e uma instancia de Right
      expect(bet.isLeft()).toBeFalsy()
      expect(bet.isRight()).toBeTruthy()
    })
  })
})
