import { IRelation } from '@root/src/2-business/repositories/relation'
import { inject, injectable } from 'inversify'
import { BetEntityKeys, IBetRepository, IInputDeleteBet, IInputUpdateBet } from '@business/repositories/bet/iBetRepository'
import { IBetEntity } from '@domain/entities/betEntity'
import { BetModel } from '@framework/database/models/betModel'

@injectable()
export class BetRepository implements IBetRepository {
  constructor (@inject(BetModel) private readonly betModel: typeof BetModel) {}

  async create (
    inputUserEntity: Omit<IBetEntity, 'id' | 'user_id' | 'game_id'>,
    user_id: number,
    game_id: number
  ): Promise<IBetEntity> {
    const bet = await this.betModel.create({
      ...inputUserEntity,
      user_id,
      game_id
    })

    return bet as unknown as IBetEntity
  }

  async findBy (
    type: BetEntityKeys,
    key: IBetEntity[BetEntityKeys],
    relations?: Array<IRelation<string, BetEntityKeys>>
  ): Promise<void | IBetEntity> {
    try {
      const bet = await this.betModel.findOne({
        where: { [type]: key },
        include:
        relations?.map((relation) => ({
          association: relation.tableName
        }))
      })
      if (bet) {
        const plainUser = bet.get({ plain: true })
        return plainUser
      } else {
        throw new Error()
      }
    } catch {
      return void 0
    }
  }

  async update (input: IInputUpdateBet): Promise<Partial<IBetEntity> | void> {
    const { newData, updateWhere } = input

    await this.betModel.update(newData, {
      where: { [updateWhere.column]: updateWhere.value }
    })

    return input.newData
  }

  async delete (input: IInputDeleteBet): Promise<IBetEntity | void> {
    try {
      const bet = await this.betModel.findOne({
        where: { [input.key]: input.value }
      })
      if (bet) {
        await bet.destroy()
        return bet
      } else {
        throw new Error()
      }
    } catch (error) {
      console.error(error)
      return void 0
    }
  }

  async findAll (): Promise<IBetEntity[] | void> {
    try {
      const betsResult = await this.betModel.findAll()
      return betsResult
    } catch (error) {
      console.error(error)
      return void 0
    }
  }
}
