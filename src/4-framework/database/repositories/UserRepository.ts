import { IRelation } from '@root/src/2-business/repositories/relation'
import {
  IInputDeleteUser,
  IInputUpdateUser,
  IUserRepository,
  UserEntityKeys
} from '@root/src/2-business/repositories/user/iUserRepository'
import { IUserEntity } from '@root/src/1-domain/entities/userEntity'
import { inject, injectable } from 'inversify'
import { UserModel } from '@framework/database/models/userModel'

@injectable()
export class UserRepository implements IUserRepository {
  constructor (@inject(UserModel) private readonly userModel: typeof UserModel) {}

  async create (
    inputUserEntity: Omit<IUserEntity, 'id' | 'access_profile_id'>,
    accessProfileId: number
  ): Promise<IUserEntity> {
    const user = await this.userModel.create({
      ...inputUserEntity,
      access_profile_id: accessProfileId
    })

    return user as unknown as IUserEntity
  }

  async findBy (
    type: UserEntityKeys,
    key: IUserEntity[UserEntityKeys],
    relations?: Array<IRelation<string, UserEntityKeys>>
  ): Promise<void | IUserEntity> {
    try {
      const user = await this.userModel.findOne({
        where: { [type]: key },
        include:
        relations?.map((relation) => ({
          association: relation.tableName
        }))
      })
      if (user) {
        const plainUser = user.get({ plain: true })
        return plainUser
      } else {
        throw new Error()
      }
    } catch {
      return void 0
    }
  }

  async update (input: IInputUpdateUser): Promise<Partial<IUserEntity> | void> {
    const { newData, updateWhere } = input

    await this.userModel.update(newData, {
      where: { [updateWhere.column]: updateWhere.value }
    })

    return input.newData
  }

  async delete (input: IInputDeleteUser): Promise<IUserEntity | void> {
    try {
      const user = await this.userModel.findOne({
        where: { [input.key]: input.value }
      })
      if (user) {
        await user.destroy()
        return user
      } else {
        throw new Error()
      }
    } catch (error) {
      console.error(error)
      return void 0
    }
  }

  async findAll (): Promise<Array<Omit<IUserEntity, 'password'>> | void> {
    try {
      const usersResult = await this.userModel.findAll()
      return usersResult
    } catch (error) {
      console.error(error)
      return void 0
    }
  }
}
