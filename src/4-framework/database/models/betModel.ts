'use strict'
import { Model, DataTypes } from 'sequelize'
import { sequelize } from '@framework/ultility/database'
import { UserModel } from './userModel'
import { GameModel } from './gameModel'
import { IBetEntity } from '@domain/entities/betEntity'
export class BetModel extends Model {}

// eslint-disable-next-line
export interface BetModel extends IBetEntity {}

BetModel.init(
  {
    secure_id: {
      type: DataTypes.UUIDV4,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    game_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price_game: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    numberChoose: {
      type: DataTypes.STRING,
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
    tableName: 'bets',
    timestamps: false,
    underscored: true,
    sequelize
  }
)

BetModel.hasOne(UserModel, { foreignKey: 'id' })
BetModel.hasOne(GameModel, { foreignKey: 'id' })
