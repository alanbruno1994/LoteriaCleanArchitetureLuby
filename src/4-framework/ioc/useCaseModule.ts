import { AuthorizeAccessProfileUseCase } from '@business/useCases/access/authorizeAccessProfileUseCase'
import { CreateAccessProfileUseCase } from '@business/useCases/access/createAccessProfileUseCase'
import { DeleteAccessProfileUseCase } from '@business/useCases/access/deleteAccessProfileUseCase'
import { FindAccessProfileByUseCase } from '@business/useCases/access/findAccessProfileByUseCase'
import { FindAllAccessProfileUseCase } from '@business/useCases/access/findAllAccessProfileUseCase'
import { UpdateAccessProfileUseCase } from '@business/useCases/access/updateAccessProfileUseCase'
import { CreateTokenUseCase } from '@business/useCases/authentication/createToken'
import { VerifyTokenUseCase } from '@business/useCases/authentication/verifyToken'
import { CreateBetUseCase } from '@business/useCases/bet/createBetUseCase'
import { DeleteBetUseCase } from '@business/useCases/bet/deleteBetUseCase'
import { FindAllBetsUseCase } from '@business/useCases/bet/findAllBetUseCase'
import { FindBetByUseCase } from '@business/useCases/bet/findBetByUseCase'
import { UpdateBetUseCase } from '@business/useCases/bet/updateBetUseCase'
import { CreateGameUseCase } from '@business/useCases/game/createGameUseCase'
import { DeleteGameUseCase } from '@business/useCases/game/deleteGameUseCase'
import { FindAllGamesUseCase } from '@business/useCases/game/findAllGameUseCase'
import { FindGameByUseCase } from '@business/useCases/game/findGameByUseCase'
import { UpdateGameUseCase } from '@business/useCases/game/updateGameUseCase'
import { CreateUserUseCase } from '@business/useCases/user/createUserUseCase'
import { DeleteUserUseCase } from '@business/useCases/user/deleteUserUseCase'
import { FindAllUsersUseCase } from '@business/useCases/user/findAllUsersUseCase'
import { FindUserByUseCase } from '@business/useCases/user/findUserByUseCase'
import { SendMailUseCase } from '@business/useCases/user/sendMailUseCase'
import { UpdateUserUseCase } from '@business/useCases/user/updateUserUseCase'
import { ContainerModule, interfaces } from 'inversify'

export const useCaseModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(CreateUserUseCase).to(CreateUserUseCase)
  bind(FindUserByUseCase).to(FindUserByUseCase)
  bind(CreateTokenUseCase).to(CreateTokenUseCase)
  bind(UpdateUserUseCase).to(UpdateUserUseCase)
  bind(DeleteUserUseCase).to(DeleteUserUseCase)
  bind(FindAllUsersUseCase).to(FindAllUsersUseCase)
  bind(CreateBetUseCase).to(CreateBetUseCase)
  bind(FindBetByUseCase).to(FindBetByUseCase)
  bind(UpdateBetUseCase).to(UpdateBetUseCase)
  bind(DeleteBetUseCase).to(DeleteBetUseCase)
  bind(FindAllBetsUseCase).to(FindAllBetsUseCase)
  bind(CreateGameUseCase).to(CreateGameUseCase)
  bind(FindGameByUseCase).to(FindGameByUseCase)
  bind(UpdateGameUseCase).to(UpdateGameUseCase)
  bind(DeleteGameUseCase).to(DeleteGameUseCase)
  bind(FindAllGamesUseCase).to(FindAllGamesUseCase)
  bind(CreateAccessProfileUseCase).to(CreateAccessProfileUseCase)
  bind(FindAccessProfileByUseCase).to(FindAccessProfileByUseCase)
  bind(UpdateAccessProfileUseCase).to(UpdateAccessProfileUseCase)
  bind(DeleteAccessProfileUseCase).to(DeleteAccessProfileUseCase)
  bind(FindAllAccessProfileUseCase).to(FindAllAccessProfileUseCase)
  bind(VerifyTokenUseCase).to(VerifyTokenUseCase)
  bind(AuthorizeAccessProfileUseCase).to(AuthorizeAccessProfileUseCase)
  bind(SendMailUseCase).to(SendMailUseCase)
})
