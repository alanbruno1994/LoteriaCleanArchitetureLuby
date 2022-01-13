/* eslint-disable no-void */
import { GameErrors } from '@business/modules/errors/game/gameErrors'
import { UserErrors } from '@business/modules/errors/user/userErrors'
import { IAccessProfileRepositoryToken } from '@business/repositories/accessprofile/iAccessProfileRepository'
import { IBetRepositoryToken } from '@business/repositories/bet/iBetRepository'
import { IGameRepositoryToken } from '@business/repositories/game/iGameRepository'
import { IUserRepositoryToken } from '@business/repositories/user/iUserRepository'
import { IAuthenticatorServiceToken } from '@business/services/authenticator/iAuthenticator'
import { AuthorizeAccessProfileUseCase } from '@business/useCases/access'
import { VerifyTokenUseCase } from '@business/useCases/authentication'
import { FindBetByUseCase, UpdateBetUseCase } from '@business/useCases/bet'
import { FindGameByUseCase } from '@business/useCases/game'
import { FindUserByUseCase } from '@business/useCases/user'
import { UpdateBetOperator } from '@controller/operations/bet/updateBet'
import { InputUpdateBet } from '@controller/serializers/bet/inputUpdateBet'
import { IError } from '@shared/iError'
import { container } from '@shared/ioc/container'
import { fakeBetEntity, fakeCreatedBetEntity } from '@tests/mock/fakes/entities/fakeBetEntity'
import { fakeGameEntity } from '@tests/mock/fakes/entities/fakeGameEntity'
import { fakeUserEntityPlayer } from '@tests/mock/fakes/entities/fakeUserEntity'
import { FakeAccessProfileRepository } from '@tests/mock/fakes/repositories/fakeAccessRepository'
import { FakeBetRepository, fakeBetRepositoryFindBy, fakeBetRepositoryUpdate } from '@tests/mock/fakes/repositories/fakeBetRepository'
import { FakeGameRepository, fakeGameRepositoryFindBy } from '@tests/mock/fakes/repositories/fakeGameRepository'
import { FakeUserRepository, fakeUserRepositoryFindBy } from '@tests/mock/fakes/repositories/fakeUserRepository'
import { FakerAuthenticatorServiceToken } from '@tests/mock/fakes/services/fakeAuthenticatorService'
import { FakerAuthorizeAccessProfileUseCase } from '@tests/mock/fakes/useCases/fakeAuthenticatorService'
const token_fake = 'token_valid_fake'
describe('Update access profile operator', () => {
  beforeAll(() => {
    container.bind(IBetRepositoryToken).to(FakeBetRepository)
    container.bind(IGameRepositoryToken).to(FakeGameRepository)
    container.bind(IUserRepositoryToken).to(FakeUserRepository)
    container.bind(UpdateBetOperator).to(UpdateBetOperator)
    container.bind(FindBetByUseCase).to(FindBetByUseCase)
    container.bind(FindUserByUseCase).to(FindUserByUseCase)
    container.bind(FindGameByUseCase).to(FindGameByUseCase)
    container.bind(UpdateBetUseCase).to(UpdateBetUseCase)
    container.bind(AuthorizeAccessProfileUseCase).to(FakerAuthorizeAccessProfileUseCase)
    container
      .bind(IAuthenticatorServiceToken)
      .to(FakerAuthenticatorServiceToken)
    container.bind(VerifyTokenUseCase).to(VerifyTokenUseCase)
    container.bind(IAccessProfileRepositoryToken).to(FakeAccessProfileRepository)
  })

  afterAll(() => {
    container.unbindAll()
  })

  test('Should update a access', async () => {
    const inputUpdateBet = new InputUpdateBet(fakeCreatedBetEntity)
    const operator = container.get(UpdateBetOperator)
    fakeBetRepositoryFindBy.mockImplementationOnce(
      async () => fakeBetEntity
    )
    fakeBetRepositoryUpdate.mockImplementation(async () => ({ ...fakeBetEntity, ...fakeCreatedBetEntity }))

    const access = await operator.run(inputUpdateBet, '7b1f3001-6a4b-4bdd-90e9-8a280fff017d',token_fake)

    expect(access.isLeft()).toBeFalsy()

    if (access.isRight()) {
      expect(access.value.price_game).toBe(2.5)
    }

    expect.assertions(2)
  })

  test('Should update a access using user_id and game_id', async () => {
    const inputUpdateBet = new InputUpdateBet({ ...fakeCreatedBetEntity, user_id: 1, game_id: 1 })
    const operator = container.get(UpdateBetOperator)
    fakeBetRepositoryFindBy.mockImplementationOnce(
      async () => fakeBetEntity
    )
    fakeUserRepositoryFindBy.mockImplementationOnce(
      async () => fakeUserEntityPlayer
    )
    fakeGameRepositoryFindBy.mockImplementationOnce(
      async () => fakeGameEntity
    )
    fakeBetRepositoryUpdate.mockImplementation(async () => ({ ...fakeBetEntity, ...fakeCreatedBetEntity }))

    const access = await operator.run(inputUpdateBet, '7b1f3001-6a4b-4bdd-90e9-8a280fff017d',token_fake)

    expect(access.isLeft()).toBeFalsy()

    if (access.isRight()) {
      expect(access.value.price_game).toBe(2.5)
    }

    expect.assertions(2)
  })

  // test('Should returns error if access not found', async () => {
  //   const inputUpdateBet = new InputUpdateBet(fakeCreatedBetEntity)
  //   const operator = container.get(UpdateBetOperator)
  //   fakeBetRepositoryFindBy.mockImplementationOnce(
  //     // eslint-disable-next-line no-void
  //     async () => void 0
  //   )
  //   const access = await operator.run(inputUpdateBet, '7b1f3001-6a4b-4bdd-90e9-8a280fff017d')

  //   expect(access.isRight()).toBeFalsy()

  //   if (access.isLeft()) {
  //     expect(access.value.statusCode).toBe(BetErrors.accessProfileNotFound().statusCode)
  //     expect(access.value.body).toStrictEqual(BetErrors.accessProfileNotFound().body)
  //   }

  //   expect.assertions(3)
  // })

  test('Should not update a access with invalid numberChoose', async () => {
    const inputUpdateBet = new InputUpdateBet({ number_choose: '', price_game: 2.5 })

    try {
      const operator = container.get(UpdateBetOperator)
      await operator.run(inputUpdateBet, '7b1f3001-6a4b-4bdd-90e9-8a280fff017d',token_fake)
    } catch (error) {
      expect(error).toBeInstanceOf(IError)
    }
    expect.assertions(1)
  })

  test('Should not update a access with invalid price_game', async () => {
    const inputUpdateBet = new InputUpdateBet({ number_choose: '32,45,50,51,32,40', price_game: -2.5 })

    try {
      const operator = container.get(UpdateBetOperator)
      await operator.run(inputUpdateBet, '7b1f3001-6a4b-4bdd-90e9-8a280fff017d',token_fake)
    } catch (error) {
      expect(error).toBeInstanceOf(IError)
    }
    expect.assertions(1)
  })

  test('Should not update a access with invalid user_id', async () => {
    const inputUpdateBet = new InputUpdateBet({ number_choose: '32,45,50,51,32,40', price_game: 2.5, user_id: 0 })

    try {
      const operator = container.get(UpdateBetOperator)
      await operator.run(inputUpdateBet, '7b1f3001-6a4b-4bdd-90e9-8a280fff017d',token_fake)
    } catch (error) {
      expect(error).toBeInstanceOf(IError)
    }
    expect.assertions(1)
  })

  test('Should not update a access with invalid game_id', async () => {
    const inputUpdateBet = new InputUpdateBet({ number_choose: '32,45,50,51,32,40', price_game: 2.5, game_id: 0 })

    try {
      const operator = container.get(UpdateBetOperator)
      await operator.run(inputUpdateBet, '7b1f3001-6a4b-4bdd-90e9-8a280fff017d',token_fake)
    } catch (error) {
      expect(error).toBeInstanceOf(IError)
    }
    expect.assertions(1)
  })

  test('Should not update a bet with an unexistent user', async () => {
    const inputCreateBet = new InputUpdateBet({
      user_id: 1,
      game_id: 1,
      number_choose: '03,12,20,35,40,50',
      price_game: 2.5
    })
    fakeBetRepositoryFindBy.mockImplementationOnce(
      async () => fakeBetEntity
    )
    fakeUserRepositoryFindBy.mockImplementation(async () => void 0)
    fakeGameRepositoryFindBy.mockImplementation(async () => fakeGameEntity)
    const operator = container.get(UpdateBetOperator)
    const bet = await operator.run(inputCreateBet, '7b1f3001-6a4b-4bdd-90e9-8a280fff017d',token_fake)
    expect(bet.isLeft()).toBeTruthy()
    expect(bet.isRight()).toBeFalsy()
    if (bet.isLeft()) {
      expect(bet.value.body).toStrictEqual(UserErrors.userNotFound().body)
    }

    expect.assertions(3)
  })

  test('Should not update a bet with an unexistent game', async () => {
    const inputCreateBet = new InputUpdateBet({
      user_id: 1,
      game_id: 1,
      number_choose: '03,12,20,35,40,50',
      price_game: 2.5
    })
    fakeBetRepositoryFindBy.mockImplementationOnce(
      async () => fakeBetEntity
    )
    fakeUserRepositoryFindBy.mockImplementation(async () => fakeUserEntityPlayer)
    fakeGameRepositoryFindBy.mockImplementation(async () => void 0)
    const operator = container.get(UpdateBetOperator)
    const bet = await operator.run(inputCreateBet, '7b1f3001-6a4b-4bdd-90e9-8a280fff017d',token_fake)
    expect(bet.isLeft()).toBeTruthy()
    expect(bet.isRight()).toBeFalsy()
    if (bet.isLeft()) {
      expect(bet.value.body).toStrictEqual(GameErrors.gameNotFound().body)
    }
  })
})
