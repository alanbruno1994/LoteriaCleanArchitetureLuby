import { GameEntity } from '@domain/entities/gameEntity'
import { fakeCreatedGameEntity } from '@tests/mock/fakes/entities/fakeGameEntity'

describe('Game entity', () => {
  describe('Create method', () => {
    test('Should create a game entity', () => {
      const game = GameEntity.create(fakeCreatedGameEntity)
      // testa se dado montado e uma instancia de Right
      expect(game.isLeft()).toBeFalsy()
      expect(game.isRight()).toBeTruthy()
    })
  })
})
