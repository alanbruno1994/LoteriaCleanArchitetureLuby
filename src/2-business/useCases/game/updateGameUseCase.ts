/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { IWhere } from '@business/repositories/where'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { IAbstractUseCase } from '../abstractUseCase'
import { InputUpdateGameDto, IOutputUpdateGameDto } from '@business/dto/game/update'
import { GameEntityKeys, IGameRepository, IGameRepositoryToken } from '@business/repositories/game/iGameRepository'
import { GameEntity } from '@domain/entities/gameEntity'
import { GameErrors } from '@business/modules/errors/game/gameErrors'

@injectable()
export class UpdateGameUseCase
implements IAbstractUseCase<InputUpdateGameDto, IOutputUpdateGameDto> {
  constructor (
    @inject(IGameRepositoryToken) private readonly gameRepository: IGameRepository
  ) {}

  async exec (input: InputUpdateGameDto,
    updateWhere: IWhere<GameEntityKeys, string | number>): Promise<IOutputUpdateGameDto> {
    try {
      const newGameEntity = GameEntity.update(input)

      const game = newGameEntity.value.export()

      const gameUpdate = await this.gameRepository.update({
        newData: {
          type: game.type,
          range: game.range,
          price: game.price,
          maxNumber: game.maxNumber,
          color: game.color,
          updated_at: game.updated_at
        },
        updateWhere
      })

      if (gameUpdate == null) {
        return left(GameErrors.gameNotFound())
      }

      return right(newGameEntity.value.export())
    } catch (error) {
      return left(GameErrors.gameFailedToUpdate())
    }
  }
}
