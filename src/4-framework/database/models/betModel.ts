'use strict'
import { DataTypes, Model } from 'sequelize'
import { connect } from '@framework/ultility/database'
import { IBetEntity } from '@domain/entities/betEntity'

export class BetModel extends Model {
  static associate (model: any) {
    BetModel.hasOne(model.UserModel, { foreignKey: 'id' })
    BetModel.hasOne(model.GameModel, { foreignKey: 'id' })
  }
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
    sequelize: connect
  }
)
