import { inject, injectable } from 'inversify'
import { left, right } from '@shared/either'
import {
  IUniqueIdentifierService,
  IUniqueIdentifierServiceToken
} from '@root/src/2-business/services/uniqueIdentifier/iUniqueIdentifier'
import { IAbstractUseCase } from '../abstractUseCase'
import { IInputCreateGameDto, IOutputCreateGameDto } from '@business/dto/game/create'
import { IGameRepository, IGameRepositoryToken } from '@business/repositories/game/iGameRepository'
import { GameEntity } from '@domain/entities/gameEntity'
import { GameErrors } from '@business/modules/errors/game/gameErrors'

@injectable() // Aqui indica que a classe faz parte das injecoes dinamicas
export class CreateGameUseCase
implements IAbstractUseCase<IInputCreateGameDto, IOutputCreateGameDto> {
  // @inject e usado para faz as injecoes dinamicas, ou seja, em tempo de
  // execucao.
  constructor (
    @inject(IGameRepositoryToken) private readonly gameRepository: IGameRepository,
    @inject(IUniqueIdentifierServiceToken)
    private readonly uniqueIdentifierService: IUniqueIdentifierService
  ) {}

  async exec (input: IInputCreateGameDto): Promise<IOutputCreateGameDto> {
    const createGame = GameEntity.create(input)
    const game = {
      ...createGame.value.export(),
      secureId: this.uniqueIdentifierService.create()
    }
    try {
      const gameEntity = await this.gameRepository.create(game)

      return right(gameEntity)
    } catch (error) {
      return left(GameErrors.entityCreationError())
    }
  }
}
