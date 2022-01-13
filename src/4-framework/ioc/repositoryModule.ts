import { IAccessProfileRepository, IAccessProfileRepositoryToken } from '@business/repositories/accessprofile/iAccessProfileRepository'
import { IBetRepository, IBetRepositoryToken } from '@business/repositories/bet/iBetRepository'
import { IGameRepository, IGameRepositoryToken } from '@business/repositories/game/iGameRepository'
import { AccessProfileRepository, BetRepository, GameRepository, UserRepository } from '@framework/database/repositories'

import {
  IUserRepository,
  IUserRepositoryToken
} from '@root/src/2-business/repositories/user/iUserRepository'
import { ContainerModule, interfaces } from 'inversify'

export const repositoryModule = new ContainerModule((bind: interfaces.Bind) => {
  bind<IUserRepository>(IUserRepositoryToken).to(UserRepository)
  bind<IGameRepository>(IGameRepositoryToken).to(GameRepository)
  bind<IBetRepository>(IBetRepositoryToken).to(BetRepository)
  bind<IAccessProfileRepository>(IAccessProfileRepositoryToken).to(AccessProfileRepository)
})
