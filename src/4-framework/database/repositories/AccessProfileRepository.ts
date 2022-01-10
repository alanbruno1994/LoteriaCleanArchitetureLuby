/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { IRelation } from '@root/src/2-business/repositories/relation'
import { inject, injectable } from 'inversify'
import { AccessProfileEntityKeys, IAccessProfileRepository, IInputDeleteAccess, IInputUpdateAccess } from '@business/repositories/accessprofile/iAccessProfileRepository'
import { IAccessProfileEntity } from '@domain/entities/accessProfileEntity'
import { AccessProfileModel } from '@framework/database/models/accessprofileModel'
// import setupRelations from '../models/setupRelations'
@injectable()
export class AccessProfileRepository implements IAccessProfileRepository {
  constructor (@inject(AccessProfileModel) private readonly accessProfileModel: typeof AccessProfileModel) {
  //  this.user = setupRelations().UserModel
  }

  async create (
    inputAccessProfileEntity: Omit<IAccessProfileEntity, 'id'>
  ): Promise<IAccessProfileEntity> {
    const accessProfile = await this.accessProfileModel.create({
      ...inputAccessProfileEntity
    })

    return accessProfile as unknown as IAccessProfileEntity
  }

  async findBy (
    type: AccessProfileEntityKeys,
    key: IAccessProfileEntity[AccessProfileEntityKeys],
    relations?: Array<IRelation<string, AccessProfileEntityKeys>>
  ): Promise<void | IAccessProfileEntity> {
    try {
      const accessProfile = await this.accessProfileModel.findOne({
        where: { [type]: key },
        include:
        relations?.map((relation) => ({
          association: relation.tableName
        }))
      })
      if (accessProfile) {
        const plainGame = accessProfile.get({ plain: true })
        return plainGame
      } else {
        throw new Error()
      }
    } catch {
      return void 0
    }
  }

  async update (input: IInputUpdateAccess): Promise<Partial<IAccessProfileEntity> | void> {
    const { newData, updateWhere } = input

    await this.accessProfileModel.update(newData, {
      where: { [updateWhere.column]: updateWhere.value }
    })

    return input.newData
  }

  async delete (input: IInputDeleteAccess): Promise<IAccessProfileEntity | void> {
    try {
      const accessProfile = await this.accessProfileModel.findOne({
        where: { [input.key]: input.value }
      })
      if (accessProfile) {
        await accessProfile.destroy()
        return accessProfile
      } else {
        throw new Error()
      }
    } catch (error) {
      console.error(error)
      return void 0
    }
  }

  async findAll (relations?: Array<IRelation<string, AccessProfileEntityKeys>>): Promise<IAccessProfileEntity[] | void> {
    try {
      const accessProfilesResult = await this.accessProfileModel.findAll(
        {
          include:
          relations?.map((relation) => ({
            association: relation.tableName
          }))
        }
      )
      return accessProfilesResult
    } catch (error) {
      console.error(error)
      return void 0
    }
  }
}
