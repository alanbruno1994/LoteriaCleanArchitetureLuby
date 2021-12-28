import { AccessProfileEntity } from '@domain/entities/accessProfileEntity'
import { fakeCreatedAccessProfileEntity } from '@tests/mock/fakes/entities/fakeAccessProfileEntity'

describe('AccessProfile entity', () => {
  describe('Create method', () => {
    test('Should create a access profile entity', () => {
      const bet = AccessProfileEntity.create(fakeCreatedAccessProfileEntity)
      // testa se dado montado e uma instancia de Right
      expect(bet.isLeft()).toBeFalsy()
      expect(bet.isRight()).toBeTruthy()
    })
  })
})
