/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable no-void */
// Make sure that container is first called, reflect-metada is important for decorators which are used in subsequent imports

import { BetErrors } from '@business/modules/errors/bet/betErrors'
import { IBetRepositoryToken } from '@business/repositories/bet/iBetRepository'
import { IServiceDataSendToken } from '@business/services/microservices/iServiceDataSend'
import { IUniqueIdentifierServiceToken } from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import { CreateBetUseCase } from '@business/useCases/bet/createBetUseCase'
import { DeleteBetUseCase } from '@business/useCases/bet/deleteBetUseCase'
import { FindAllBetsUseCase } from '@business/useCases/bet/findAllBetUseCase'
import { FindBetByUseCase } from '@business/useCases/bet/findBetByUseCase'
import { UpdateBetUseCase } from '@business/useCases/bet/updateBetUseCase'
import { container } from '@shared/ioc/container'
import { fakeBetEntity, fakeBetsList, fakeNewBet } from '@tests/mock/fakes/entities/fakeBetEntity'
import { FakeBetRepository, fakeBetRepositoryDelete, fakeBetRepositoryFindAll, fakeBetRepositoryFindBy } from '@tests/mock/fakes/repositories/fakeBetRepository'
import { FakeServiceDataSendBet } from '@tests/mock/fakes/services/fakeServiceDataSendBet'
import { FakeUniqueIdentifierService } from '@tests/mock/fakes/services/fakeUniqueIdentifierService'

describe('Bet use cases', () => {
  jest.spyOn(console, 'error').mockImplementation(() => ({}))

  const createBetError = BetErrors.entityCreationError()
  const betNotFoundError = BetErrors.betNotFound()

  beforeAll(() => {
    container.bind(CreateBetUseCase).to(CreateBetUseCase)
    container.bind(FindBetByUseCase).to(FindBetByUseCase)
    container.bind(FindAllBetsUseCase).to(FindAllBetsUseCase)
    container.bind(UpdateBetUseCase).to(UpdateBetUseCase)
    container.bind(DeleteBetUseCase).to(DeleteBetUseCase)
    container.bind(IBetRepositoryToken).to(FakeBetRepository)
    container.bind(IServiceDataSendToken).to(FakeServiceDataSendBet)
    container
      .bind(IUniqueIdentifierServiceToken)
      .to(FakeUniqueIdentifierService)
  })

  afterAll(() => {
    container.unbindAll()
  })

  describe('CreateBet', () => {
    // Aqui esta mocando para alterar o comportamento do metodo create
    const mockRepositoryCreateBet = jest.spyOn(
      FakeBetRepository.prototype,
      'create'
    )
    test('Should create an bet', async () => {
      const operator = container.get(CreateBetUseCase)
      const betEntity = await operator.exec(fakeNewBet)

      expect(betEntity.isLeft()).toBeFalsy()
      expect(betEntity.isRight()).toBeTruthy()

      if (betEntity.isRight()) {
        expect(betEntity.value.number_choose).toBe(fakeNewBet.number_choose)
        expect(betEntity.value.price_game).toBe(fakeNewBet.price_game)
        expect(betEntity.value.game_id).toBe(fakeNewBet.game_id)
        expect(betEntity.value.user_id).toBe(fakeNewBet.user_id)
      }

      expect.assertions(6)
    })

    test('Should throw an error if repository fails in its process', async () => {
      const operator = container.get(CreateBetUseCase)
      // Altera o comportamento para gerar um error
      mockRepositoryCreateBet.mockImplementation(() => {
        throw new Error()
      })
      const betEntity = await operator.exec(fakeNewBet)

      expect(betEntity.isLeft()).toBeTruthy()
      expect(betEntity.isRight()).toBeFalsy()

      if (betEntity.isLeft()) {
        expect(betEntity.value.statusCode).toBe(createBetError.statusCode)
        expect(betEntity.value.body).toStrictEqual(createBetError.body)
      }

      expect.assertions(4)
    })
  })

  describe('FindBetBy', () => {
    test('Should return bet if it exists', async () => {
      const betFindByUseCase = container.get(FindBetByUseCase)

      fakeBetRepositoryFindBy.mockImplementation(async () => fakeBetEntity)

      const betResult = await betFindByUseCase.exec({
        key: 'secure_id',
        value: fakeBetEntity.secure_id
      })

      expect(betResult.isLeft()).toBeFalsy()
      expect(betResult.isRight()).toBeTruthy()
    })

    test('Should not find bet if it does not exists', async () => {
      const betRepository = container.get(FindBetByUseCase)

      fakeBetRepositoryFindBy.mockImplementation(async () => void 0)

      const betResult = await betRepository.exec({
        key: 'secure_id',
        value: 'Not Exists'
      })

      expect(betResult.isLeft()).toBeTruthy()
      expect(betResult.isRight()).toBeFalsy()

      if (betResult.isLeft()) {
        expect(betResult.value.statusCode).toBe(betNotFoundError.statusCode)
        expect(betResult.value.body).toStrictEqual(betNotFoundError.body)
      }

      expect.assertions(4)
    })
  })

  describe('updateBet', () => {
    const mockBetUpdate = jest.spyOn(FakeBetRepository.prototype, 'update')

    test('Should return bet updated if repository.update returns bet', async () => {
      const updateRepository = container.get(UpdateBetUseCase)
      mockBetUpdate.mockImplementationOnce(async () => fakeBetEntity)
      const betUpdated = await updateRepository.exec(fakeBetEntity, {
        column: 'id',
        value: ''
      })
      expect(betUpdated.isLeft()).toBeFalsy()

      if (betUpdated.isRight()) {
        expect(betUpdated.value.updated_at).not.toBe(fakeBetEntity.updated_at)
      }

      expect.assertions(2)
    })

    test('Should throws bet not found error if repository.update returns void', async () => {
      const updateRepository = container.get(UpdateBetUseCase)
      const betUpdated = await updateRepository.exec(fakeBetEntity, {
        column: 'id',
        value: ''
      })
      expect(betUpdated.isRight()).toBeFalsy()

      if (betUpdated.isLeft()) {
        expect(betUpdated.value.statusCode).toBe(
          BetErrors.betNotFound().statusCode
        )
        expect(betUpdated.value.body).toStrictEqual(
          BetErrors.betNotFound().body
        )
      }

      expect.assertions(3)
    })

    test('Should throws bet not found error if repository.update returns void', async () => {
      const updateRepository = container.get(UpdateBetUseCase)

      mockBetUpdate.mockImplementationOnce(async () => {
        throw new Error()
      })

      const betUpdated = await updateRepository.exec(fakeBetEntity, {
        column: 'id',
        value: ''
      })
      expect(betUpdated.isRight()).toBeFalsy()

      if (betUpdated.isLeft()) {
        expect(betUpdated.value.statusCode).toBe(
          BetErrors.betFailedToUpdate().statusCode
        )
        expect(betUpdated.value.body).toStrictEqual(
          BetErrors.betFailedToUpdate().body
        )
      }

      expect.assertions(3)
    })
  })

  describe('Delete bet use case', () => {
    test('Should delete a bet', async () => {
      const operator = container.get(DeleteBetUseCase)
      fakeBetRepositoryDelete.mockImplementationOnce(
        async () => fakeBetEntity
      )

      const deletedRole = await operator.exec({
        key: 'id',
        value: fakeBetEntity.id
      })

      expect(deletedRole.isLeft()).toBeFalsy()
      if (deletedRole.isRight()) {
        expect(deletedRole.value).toStrictEqual(fakeBetEntity)
      }

      expect.assertions(2)
    })

    test('Should returns error if repository return void', async () => {
      const operator = container.get(DeleteBetUseCase)

      const deletedBet = await operator.exec({
        key: 'id',
        value: fakeBetEntity.id
      })

      expect(deletedBet.isRight()).toBeFalsy()
      if (deletedBet.isLeft()) {
        expect(deletedBet.value.statusCode).toBe(
          BetErrors.betFailedToDelete().statusCode
        )
        expect(deletedBet.value.body).toStrictEqual(
          BetErrors.betFailedToDelete().body
        )
      }

      expect.assertions(3)
    })
  })

  describe('Find all bet use case', () => {
    test('Should returns all bets', async () => {
      const useCase = container.get(FindAllBetsUseCase)
      fakeBetRepositoryFindAll.mockImplementationOnce(async () => fakeBetsList)
      const betsFound = await useCase.exec()

      expect(betsFound.isLeft()).toBeFalsy()
      if (betsFound.isRight()) {
        expect(betsFound.value.length).toBe(4)
      }
      expect.assertions(2)
    })

    test('Should returns all bets if not exists bets', async () => {
      const useCase = container.get(FindAllBetsUseCase)
      const rolesFound = await useCase.exec()
      expect(rolesFound.isRight()).toBeTruthy()
      expect.assertions(1)
    })

    test('Should returns error if repository return undefined', async () => {
      const useCase = container.get(FindAllBetsUseCase)
      fakeBetRepositoryFindAll.mockImplementationOnce(async () => void 0)
      const rolesFound = await useCase.exec()
      expect(rolesFound.isRight()).toBeFalsy()
      if (rolesFound.isLeft()) {
        expect(rolesFound.value.statusCode).toBe(
          BetErrors.betNotLoadedCorrectly().statusCode
        )
        expect(rolesFound.value.body).toStrictEqual(
          BetErrors.betNotLoadedCorrectly().body
        )
      }
      expect.assertions(3)
    })
  })
})
