/* eslint-disable no-void */
import { container } from '@shared/ioc/container'
import { IBetRepositoryToken } from '@root/src/2-business/repositories/bet/iBetRepository'
import { IUniqueIdentifierServiceToken } from '@root/src/2-business/services/uniqueIdentifier/iUniqueIdentifier'
import {
  FakeBetRepository, fakeBetRepositoryCreate
} from '@tests/mock/fakes/repositories/fakeBetRepository'
import { FakeUniqueIdentifierService } from '@tests/mock/fakes/services/fakeUniqueIdentifierService'
import { IError } from '@shared/iError'
import { BetErrors } from '@business/modules/errors/bet/betErrors'
import { CreateBetOperator } from '@controller/operations/bet/createBet'
import { fakeBetEntity } from '@tests/mock/fakes/entities/fakeBetEntity'
import { FakeUserRepository, fakeUserRepositoryFindBy } from '@tests/mock/fakes/repositories/fakeUserRepository'
import { fakeUserEntityPlayer } from '@tests/mock/fakes/entities/fakeUserEntity'
import { FakeGameRepository, fakeGameRepositoryFindBy } from '@tests/mock/fakes/repositories/fakeGameRepository'
import { fakeGameEntity } from '@tests/mock/fakes/entities/fakeGameEntity'
import { UserErrors } from '@business/modules/errors/user/userErrors'
import { GameErrors } from '@business/modules/errors/game/gameErrors'
import { IUserRepositoryToken } from '@business/repositories/user/iUserRepository'
import { IGameRepositoryToken } from '@business/repositories/game/iGameRepository'
import { IAuthenticatorServiceToken } from '@business/services/authenticator/iAuthenticator'
import { FakerAuthenticatorServiceToken } from '@tests/mock/fakes/services/fakeAuthenticatorService'
import { FakeAccessProfileRepository } from '@tests/mock/fakes/repositories/fakeAccessRepository'
import { IAccessProfileRepositoryToken } from '@business/repositories/accessprofile/iAccessProfileRepository'
import { VerifyTokenUseCase } from '@business/useCases/authentication'
import { AuthorizeAccessProfileUseCase } from '@business/useCases/access'
import { FindGameByUseCase } from '@business/useCases/game'
import { FakerAuthorizeAccessProfileUseCase } from '@tests/mock/fakes/useCases/fakeAuthenticatorService'
import { FindUserByUseCase } from '@business/useCases/user'
import { CreateBetUseCase, FindBetByUseCase } from '@business/useCases/bet'
import { InputCreateBet } from '@controller/serializers/bet'

const token_fake = 'token_valid_fake'
describe('Create bet operator', () => {
  const userNotFound = UserErrors.userNotFound()
  const gameNotFound = GameErrors.gameNotFound()
  const betEntityCreationError = BetErrors.entityCreationError()

  beforeAll(() => {
    container.bind(IBetRepositoryToken).to(FakeBetRepository)
    container.bind(IUserRepositoryToken).to(FakeUserRepository)
    container.bind(IGameRepositoryToken).to(FakeGameRepository)
    container
      .bind(IUniqueIdentifierServiceToken)
      .to(FakeUniqueIdentifierService)
    container.bind(CreateBetUseCase).to(CreateBetUseCase)
    container.bind(FindBetByUseCase).to(FindBetByUseCase)
    container.bind(FindUserByUseCase).to(FindUserByUseCase)
    container.bind(FindGameByUseCase).to(FindGameByUseCase)
    container.bind(CreateBetOperator).to(CreateBetOperator)
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

  test('Should create a bet', async () => {
    const inputCreateBet = new InputCreateBet({
      game_id: 1,
      number_choose: '03,12,20,35,40,50',
      price_game: 2.5
    })

    fakeBetRepositoryCreate.mockImplementationOnce(async () => fakeBetEntity)
    fakeUserRepositoryFindBy.mockImplementationOnce(async () => fakeUserEntityPlayer)
    fakeGameRepositoryFindBy.mockImplementationOnce(async () => fakeGameEntity)

    const operator = container.get(CreateBetOperator)
    const bet = await operator.run(inputCreateBet,token_fake)
    expect(bet.isLeft()).toBeFalsy()
    expect(bet.isRight()).toBeTruthy()
    if (bet.isRight()) {
      expect(bet.value.game_id).toBe(1)
      expect(bet.value.user_id).toBe(1)
    }
    expect.assertions(4)
  })

  test('Should not create a bet with invalid game_id', async () => {
    const inputCreateBet = new InputCreateBet({
      game_id: 0,
      number_choose: '03,12,20,35,40,50',
      price_game: 2.5
    })

    try {
      const operator = container.get(CreateBetOperator)
      await operator.run(inputCreateBet,token_fake)
    } catch (error) {
      expect(error).toBeInstanceOf(IError)
    }
    expect.assertions(1)
  })

  test('Should not create a bet with invalid numberChoose', async () => {
    const inputCreateBet = new InputCreateBet({
      game_id: 1,
      number_choose: '',
      price_game: 2.5
    })

    try {
      const operator = container.get(CreateBetOperator)
      await operator.run(inputCreateBet,token_fake)
    } catch (error) {
      expect(error).toBeInstanceOf(IError)
    }
    expect.assertions(1)
  })

  test('Should not create a bet with invalid price_game', async () => {
    const inputCreateBet = new InputCreateBet({
      game_id: 1,
      number_choose: '03,12,20,35,40,50',
      price_game: -2.5
    })

    try {
      const operator = container.get(CreateBetOperator)
      await operator.run(inputCreateBet,token_fake)
    } catch (error) {
      expect(error).toBeInstanceOf(IError)
    }
    expect.assertions(1)
  })

  test('Should not create a bet with an unexistent user', async () => {
    const inputCreateBet = new InputCreateBet({
      game_id: 1,
      number_choose: '03,12,20,35,40,50',
      price_game: 2.5
    })
    fakeUserRepositoryFindBy.mockImplementation(async () => void 0)
    fakeGameRepositoryFindBy.mockImplementation(async () => fakeGameEntity)
    const operator = container.get(CreateBetOperator)
    const bet = await operator.run(inputCreateBet,token_fake)
    expect(bet.isLeft()).toBeTruthy()
    expect(bet.isRight()).toBeFalsy()
    if (bet.isLeft()) {
      expect(bet.value.body).toStrictEqual(userNotFound.body)
    }

    expect.assertions(3)
  })

  test('Should not create a bet with an unexistent game', async () => {
    const inputCreateBet = new InputCreateBet({
      game_id: 1,
      number_choose: '03,12,20,35,40,50',
      price_game: 2.5
    })
    fakeUserRepositoryFindBy.mockImplementation(async () => fakeUserEntityPlayer)
    fakeGameRepositoryFindBy.mockImplementation(async () => void 0)
    const operator = container.get(CreateBetOperator)
    const bet = await operator.run(inputCreateBet,token_fake)
    expect(bet.isLeft()).toBeTruthy()
    expect(bet.isRight()).toBeFalsy()
    if (bet.isLeft()) {
      expect(bet.value.body).toStrictEqual(gameNotFound.body)
    }

    expect.assertions(3)
  })

  test('Should not create a bet if bet repository create method throws', async () => {
    const inputCreateBet = new InputCreateBet({
      game_id: 1,
      number_choose: '03,12,20,35,40,50',
      price_game: 2.5
    })
    fakeUserRepositoryFindBy.mockImplementation(async () => fakeUserEntityPlayer)
    fakeGameRepositoryFindBy.mockImplementation(async () => fakeGameEntity)

    fakeBetRepositoryCreate.mockImplementation(async () => {
      throw new Error()
    })
    const operator = container.get(CreateBetOperator)

    const bet = await operator.run(inputCreateBet,token_fake)

    expect(bet.isLeft()).toBeTruthy()
    expect(bet.isRight()).toBeFalsy()

    if (bet.isLeft()) {
      expect(bet.value.body).toStrictEqual(betEntityCreationError.body)
    }

    expect.assertions(3)
  })
})
