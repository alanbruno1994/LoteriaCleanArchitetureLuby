/* eslint-disable @typescript-eslint/semi */
'use strict'
import { DataTypes, Model } from 'sequelize'
import { sequelize } from '@framework/ultility/database'
import { IUserEntity } from '@root/src/1-domain/entities/userEntity'
import { AccessProfileModel } from './accessprofileModel'
import { BetModel } from './betModel'

export class UserModel extends Model {}

// eslint-disable-next-line
export interface UserModel extends IUserEntity {}

UserModel.init(
  {
    secure_id: {
      type: DataTypes.UUIDV4,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    access_profile_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    token_recover_password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    token_recover_password_expire_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    tableName: 'users',
    timestamps: false,
    underscored: true,
    sequelize
  }
)

UserModel.addHook('afterSave',
  async (user: any): Promise<void> => {
    user.password = null
  })

UserModel.addHook('afterFind',
  async (user: any): Promise<void> => {
    if (user.constructor === Array) {
      user.map(value => {
        value.dataValues.password = null
        return value
      })
    }
  })

UserModel.addHook('afterQuery',
  async (user: any): Promise<void> => {
    user.password = null
  })

UserModel.belongsTo(AccessProfileModel, {
  as: 'access',
  foreignKey: 'access_profile_id'
})

AccessProfileModel.hasMany(UserModel, {
  as: 'users',
  foreignKey: 'access_profile_id'
})

UserModel.hasMany(BetModel, {
  as: 'bets',
  foreignKey: 'user_id'
})
