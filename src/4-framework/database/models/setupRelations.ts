import { AccessProfileModel } from './accessprofileModel'
import { BetModel } from './betModel'
import { GameModel } from './gameModel'
import { UserModel } from './userModel'

function setupRelations () {
  AccessProfileModel.hasOne(UserModel, {
    foreignKey: 'access_profile_id'
  })

  UserModel.belongsTo(AccessProfileModel, {
    foreignKey: 'access_profile_id'
  })

  BetModel.hasOne(UserModel, { foreignKey: 'id' })
  BetModel.hasOne(GameModel, { foreignKey: 'id' })

  GameModel.belongsToMany(UserModel, {
    as: 'data_user',
    through: BetModel,
    foreignKey: 'game_id'
  })

  UserModel.belongsToMany(GameModel, {
    as: 'games',
    through: BetModel,
    foreignKey: 'user_id'
  })
  return { UserModel,GameModel,BetModel,AccessProfileModel }
}
export default setupRelations
