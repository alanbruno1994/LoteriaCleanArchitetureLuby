import { IRelation } from '@root/src/2-business/repositories/relation'
import { inject, injectable } from 'inversify'
import { GameModel } from '@framework/database/models/gameModel'
import { GameEntityKeys, IGameRepository, IInputDeleteGame, IInputUpdateGame } from '@business/repositories/game/iGameRepository'
import { IGameEntity } from '@domain/entities/gameEntity'

@injectable()
export class GameRepository implements IGameRepository {
  constructor (@inject(GameModel) private readonly gameModel: typeof GameModel) {}

  async create (
    inputGameEntity: Omit<IGameEntity, 'id'>
  ): Promise<IGameEntity> {
    const game = await this.gameModel.create({
      ...inputGameEntity
    })

    return game as unknown as IGameEntity
  }

  async findBy (
    type: GameEntityKeys,
    key: IGameEntity[GameEntityKeys],
    relations?: Array<IRelation<string, GameEntityKeys>>
  ): Promise<void | IGameEntity> {
    try {
      const game = await this.gameModel.findOne({
        where: { [type]: key },
        include:
        relations?.map((relation) => ({
          association: relation.tableName
        }))
      })
      if (game) {
        const plainGame = game.get({ plain: true })
        return plainGame
      } else {
        throw new Error()
      }
    } catch {
      return void 0
    }
  }

  async update (input: IInputUpdateGame): Promise<Partial<IGameEntity> | void> {
    const { newData, updateWhere } = input

    await this.gameModel.update(newData, {
      where: { [updateWhere.column]: updateWhere.value }
    })

    return input.newData
  }

  async delete (input: IInputDeleteGame): Promise<IGameEntity | void> {
    try {
      const game = await this.gameModel.findOne({
        where: { [input.key]: input.value }
      })
      if (game) {
        await game.destroy()
        return game
      } else {
        throw new Error()
      }
    } catch (error) {
      console.error(error)
      return void 0
    }
  }

  async findAll (): Promise<IGameEntity[] | void> {
    try {
      const gamesResult = await this.gameModel.findAll()
      return gamesResult
    } catch (error) {
      console.error(error)
      return void 0
    }
  }
}
