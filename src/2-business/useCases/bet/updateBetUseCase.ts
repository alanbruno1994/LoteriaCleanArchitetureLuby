/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { IWhere } from '@business/repositories/where'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { IAbstractUseCase } from '../abstractUseCase'
import { InputUpdateBetDto, IOutputUpdateBetDto } from '@business/dto/bet/update'
import { BetErrors } from '@business/modules/errors/bet/betErrors'
import { BetEntity } from '@domain/entities/betEntity'
import { BetEntityKeys, IBetRepository, IBetRepositoryToken } from '@business/repositories/bet/iBetRepository'

@injectable()
export class UpdateBetUseCase
implements IAbstractUseCase<InputUpdateBetDto, IOutputUpdateBetDto> {
  constructor (
    @inject(IBetRepositoryToken) private readonly betRepository: IBetRepository
  ) {}

  async exec (input: InputUpdateBetDto,
    updateWhere: IWhere<BetEntityKeys, string | number>): Promise<IOutputUpdateBetDto> {
    try {
      const newBetEntity = BetEntity.update(input)

      const game = newBetEntity.value.export()

      const gameUpdate = await this.betRepository.update({
        newData: {
          userId: game.userId,
          gameId: game.gameId,
          priceGame: game.priceGame,
          numbeChoose: game.numbeChoose,
          updated_at: game.updated_at
        },
        updateWhere
      })

      if (gameUpdate == null) {
        return left(BetErrors.betNotFound())
      }

      return right(newBetEntity.value.export())
    } catch (error) {
      return left(BetErrors.betFailedToUpdate())
    }
  }
}
