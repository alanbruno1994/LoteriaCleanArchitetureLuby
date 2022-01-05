/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable no-void */
// Make sure that container is first called, reflect-metada is important for decorators which are used in subsequent imports

import { GameErrors } from '@business/modules/errors/game/gameErrors'
import { IGameRepositoryToken } from '@business/repositories/game/iGameRepository'
import { IUniqueIdentifierServiceToken } from '@business/services/uniqueIdentifier/iUniqueIdentifier'
import { CreateGameUseCase } from '@business/useCases/game/createGameUseCase'
import { DeleteGameUseCase } from '@business/useCases/game/deleteGameUseCase'
import { FindAllGamesUseCase } from '@business/useCases/game/findAllGameUseCase'
import { FindGameByUseCase } from '@business/useCases/game/findGameByUseCase'
import { UpdateGameUseCase } from '@business/useCases/game/updateGameUseCase'
import { container } from '@shared/ioc/container'
import { fakeGameEntity, fakeGameList, fakeNewGame } from '@tests/mock/fakes/entities/fakeGameEntity'
import { FakeGameRepository, fakeGameRepositoryDelete, fakeGameRepositoryFindAll, fakeGameRepositoryFindBy } from '@tests/mock/fakes/repositories/fakeGameRepository'
import { FakeUniqueIdentifierService } from '@tests/mock/fakes/services/fakeUniqueIdentifierService'

describe('Game use cases', () => {
  jest.spyOn(console, 'error').mockImplementation(() => ({}))

  const createGameError = GameErrors.entityCreationError()
  const gameNotFoundError = GameErrors.gameNotFound()

  beforeAll(() => {
    container.bind(CreateGameUseCase).to(CreateGameUseCase)
    container.bind(FindGameByUseCase).to(FindGameByUseCase)
    container.bind(FindAllGamesUseCase).to(FindAllGamesUseCase)
    container.bind(UpdateGameUseCase).to(UpdateGameUseCase)
    container.bind(DeleteGameUseCase).to(DeleteGameUseCase)
    container.bind(IGameRepositoryToken).to(FakeGameRepository)
    container
      .bind(IUniqueIdentifierServiceToken)
      .to(FakeUniqueIdentifierService)
  })

  afterAll(() => {
    container.unbindAll()
  })

  describe('CreateGame', () => {
    // Aqui esta mocando para alterar o comportamento do metodo create
    const mockRepositoryCreateGame = jest.spyOn(
      FakeGameRepository.prototype,
      'create'
    )
    test('Should create an game', async () => {
      const operator = container.get(CreateGameUseCase)
      const gameEntity = await operator.exec(fakeNewGame)

      expect(gameEntity.isLeft()).toBeFalsy()
      expect(gameEntity.isRight()).toBeTruthy()

      if (gameEntity.isRight()) {
        expect(gameEntity.value.price).toBe(fakeNewGame.price)
        expect(gameEntity.value.type).toBe(fakeNewGame.type)
        expect(gameEntity.value.color).toBe(fakeNewGame.color)
        expect(gameEntity.value.range).toBe(fakeNewGame.range)
        expect(gameEntity.value.max_number).toBe(fakeNewGame.max_number)
      }

      expect.assertions(7)
    })

    test('Should throw an error if repository fails in its process', async () => {
      const operator = container.get(CreateGameUseCase)
      // Altera o comportamento para gerar um error
      mockRepositoryCreateGame.mockImplementation(() => {
        throw new Error()
      })
      const gameEntity = await operator.exec(fakeNewGame)

      expect(gameEntity.isLeft()).toBeTruthy()
      expect(gameEntity.isRight()).toBeFalsy()

      if (gameEntity.isLeft()) {
        expect(gameEntity.value.statusCode).toBe(createGameError.statusCode)
        expect(gameEntity.value.body).toStrictEqual(createGameError.body)
      }

      expect.assertions(4)
    })
  })

  describe('FindGameBy', () => {
    test('Should return game if it exists', async () => {
      const gameFindByUseCase = container.get(FindGameByUseCase)

      fakeGameRepositoryFindBy.mockImplementation(async () => fakeGameEntity)

      const gameResult = await gameFindByUseCase.exec({
        key: 'secure_id',
        value: fakeGameEntity.secure_id
      })

      expect(gameResult.isLeft()).toBeFalsy()
      expect(gameResult.isRight()).toBeTruthy()
    })

    test('Should not find game if it does not exists', async () => {
      const gameRepository = container.get(FindGameByUseCase)

      fakeGameRepositoryFindBy.mockImplementation(async () => void 0)

      const gameResult = await gameRepository.exec({
        key: 'secure_id',
        value: 'Not exists'
      })

      expect(gameResult.isLeft()).toBeTruthy()
      expect(gameResult.isRight()).toBeFalsy()

      if (gameResult.isLeft()) {
        expect(gameResult.value.statusCode).toBe(gameNotFoundError.statusCode)
        expect(gameResult.value.body).toStrictEqual(gameNotFoundError.body)
      }

      expect.assertions(4)
    })
  })

  describe('updateGame', () => {
    const mockGameUpdate = jest.spyOn(FakeGameRepository.prototype, 'update')

    test('Should return game updated if repository.update returns game', async () => {
      const updateRepository = container.get(UpdateGameUseCase)
      mockGameUpdate.mockImplementationOnce(async () => fakeGameEntity)
      const gameUpdated = await updateRepository.exec(fakeGameEntity, {
        column: 'id',
        value: ''
      })
      expect(gameUpdated.isLeft()).toBeFalsy()

      if (gameUpdated.isRight()) {
        expect(gameUpdated.value.updated_at).not.toBe(fakeGameEntity.updated_at)
      }

      expect.assertions(2)
    })

    test('Should throws game not found error if repository.update returns void', async () => {
      const updateRepository = container.get(UpdateGameUseCase)
      const gameUpdated = await updateRepository.exec(fakeGameEntity, {
        column: 'id',
        value: ''
      })
      expect(gameUpdated.isRight()).toBeFalsy()

      if (gameUpdated.isLeft()) {
        expect(gameUpdated.value.statusCode).toBe(
          GameErrors.gameNotFound().statusCode
        )
        expect(gameUpdated.value.body).toStrictEqual(
          GameErrors.gameNotFound().body
        )
      }

      expect.assertions(3)
    })

    test('Should throws game not found error if repository.update returns void', async () => {
      const updateRepository = container.get(UpdateGameUseCase)

      mockGameUpdate.mockImplementationOnce(async () => {
        throw new Error()
      })

      const gameUpdated = await updateRepository.exec(fakeGameEntity, {
        column: 'id',
        value: ''
      })
      expect(gameUpdated.isRight()).toBeFalsy()

      if (gameUpdated.isLeft()) {
        expect(gameUpdated.value.statusCode).toBe(
          GameErrors.gameFailedToUpdate().statusCode
        )
        expect(gameUpdated.value.body).toStrictEqual(
          GameErrors.gameFailedToUpdate().body
        )
      }

      expect.assertions(3)
    })
  })

  describe('Delete game use case', () => {
    test('Should delete a game', async () => {
      const operator = container.get(DeleteGameUseCase)
      fakeGameRepositoryDelete.mockImplementationOnce(
        async () => fakeGameEntity
      )

      const deletedRole = await operator.exec({
        key: 'id',
        value: fakeGameEntity.id
      })

      expect(deletedRole.isLeft()).toBeFalsy()
      if (deletedRole.isRight()) {
        expect(deletedRole.value).toStrictEqual(fakeGameEntity)
      }

      expect.assertions(2)
    })

    test('Should returns error if repository return void', async () => {
      const operator = container.get(DeleteGameUseCase)

      const deletedGame = await operator.exec({
        key: 'id',
        value: fakeGameEntity.id
      })

      expect(deletedGame.isRight()).toBeFalsy()
      if (deletedGame.isLeft()) {
        expect(deletedGame.value.statusCode).toBe(
          GameErrors.gameFailedToDelete().statusCode
        )
        expect(deletedGame.value.body).toStrictEqual(
          GameErrors.gameFailedToDelete().body
        )
      }

      expect.assertions(3)
    })
  })

  describe('Find all game use case', () => {
    test('Should returns all games', async () => {
      const useCase = container.get(FindAllGamesUseCase)
      fakeGameRepositoryFindAll.mockImplementationOnce(async () => fakeGameList)
      const gamesFound = await useCase.exec()

      expect(gamesFound.isLeft()).toBeFalsy()
      if (gamesFound.isRight()) {
        expect(gamesFound.value.length).toBe(4)
      }
      expect.assertions(2)
    })

    test('Should returns all games if not exists games', async () => {
      const useCase = container.get(FindAllGamesUseCase)
      const rolesFound = await useCase.exec()
      expect(rolesFound.isRight()).toBeTruthy()
      expect.assertions(1)
    })

    test('Should returns error if repository return undefined', async () => {
      const useCase = container.get(FindAllGamesUseCase)
      fakeGameRepositoryFindAll.mockImplementationOnce(async () => void 0)
      const rolesFound = await useCase.exec()
      expect(rolesFound.isRight()).toBeFalsy()
      if (rolesFound.isLeft()) {
        expect(rolesFound.value.statusCode).toBe(
          GameErrors.gameNotLoadedCorrectly().statusCode
        )
        expect(rolesFound.value.body).toStrictEqual(
          GameErrors.gameNotLoadedCorrectly().body
        )
      }
      expect.assertions(3)
    })
  })
})
