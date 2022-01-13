import { UserEntity } from '@domain/entities'
import { fakeCreatedUserEntity } from '@tests/mock/fakes/entities/fakeUserEntity'

describe('User entity', () => {
  describe('Create method', () => {
    test('Should create a user entity', () => {
      const user = UserEntity.create(fakeCreatedUserEntity)
      // testa se dado montado e uma instancia de Right
      expect(user.isLeft()).toBeFalsy()
      expect(user.isRight()).toBeTruthy()
    })
  })
})
