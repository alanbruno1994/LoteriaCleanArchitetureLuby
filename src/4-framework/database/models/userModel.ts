'use strict'
import { DataTypes, Model } from 'sequelize'
import { connect } from '@framework/ultility/database'
import { IUserEntity } from '@root/src/1-domain/entities/userEntity'

export class UserModel extends Model {
  static associate (model: any) {
    UserModel.belongsTo(model.AccessProfileModel, {
      foreignKey: 'access_profile_id'
    })

    UserModel.belongsToMany(model.GameModel, {
      as: 'data_game',
      through: model.BetModel,
      foreignKey: 'user_id'
    })
  }
}

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
    token_recover_password_create_date: {
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
    sequelize: connect
  }
)
