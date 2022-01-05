'use strict'
import { Model, DataTypes } from 'sequelize'
import { sequelize } from '@framework/ultility/database'
import { UserModel } from './userModel'
import { BetModel } from './betModel'
import { IGameEntity } from '@domain/entities/gameEntity'
export class GameModel extends Model {}

// eslint-disable-next-line
export interface GameModel extends IGameEntity {}

GameModel.init(
  {
    secure_id: {
      type: DataTypes.UUIDV4,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    range: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    max_number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    color: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    tableName: 'games',
    timestamps: false,
    underscored: true,
    sequelize
  }
)

GameModel.belongsToMany(UserModel, {
  as: 'data_user',
  through: BetModel,
  foreignKey: 'game_id'
})
