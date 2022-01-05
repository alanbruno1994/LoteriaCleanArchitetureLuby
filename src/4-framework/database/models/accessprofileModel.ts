import { IAccessProfileEntity } from '@domain/entities/accessProfileEntity'
import { Model, DataTypes } from 'sequelize'
import { UserModel } from './userModel'
import { sequelize } from '@framework/ultility/database'
export class AccessProfileModel extends Model {}

export interface AccessProfileModel extends IAccessProfileEntity {}

AccessProfileModel.init(
  {
    secure_id: {
      type: DataTypes.UUIDV4,
      allowNull: false
    },
    level: {
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
    tableName: 'access_profiles',
    timestamps: false,
    underscored: true,
    sequelize
  }
)

AccessProfileModel.hasOne(UserModel, {
  foreignKey: 'access_profile_id'
})
