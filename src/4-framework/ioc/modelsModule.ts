import { AccessProfileModel } from '@framework/database/models/accessprofileModel'
import { BetModel } from '@framework/database/models/betModel'
import { GameModel } from '@framework/database/models/gameModel'
import { UserModel } from '@framework/database/models/userModel'
import { ContainerModule, interfaces } from 'inversify'

export const modelsModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(AccessProfileModel).toConstructor(AccessProfileModel)
  bind(UserModel).toConstructor(UserModel)
  bind(GameModel).toConstructor(GameModel)
  bind(BetModel).toConstructor(BetModel)
})
