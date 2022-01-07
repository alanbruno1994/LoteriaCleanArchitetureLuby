'use strict'
import { DataTypes, Model } from 'sequelize'
import { sequelize } from '@framework/ultility/database'
import { IBetEntity } from '@domain/entities/betEntity'

export class BetModel extends Model {
}

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
    number_choose: {
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
