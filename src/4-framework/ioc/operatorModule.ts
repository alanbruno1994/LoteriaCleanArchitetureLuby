import { CreateAccessProlfileOperator } from '@controller/operations/access/createAccess'
import { DeleteAccessProfileOperator } from '@controller/operations/access/deleteAccess'
import { FindAllAccessProfileOperator } from '@controller/operations/access/findAllAccess'
import { FindOneAccessProfileOperator } from '@controller/operations/access/findOneAccess'
import { UpdateAccessProfileOperator } from '@controller/operations/access/updateAccess'
import { CreateAuthenticationOperator } from '@controller/operations/authentication/createAuthentication'
import { CreateBetOperator } from '@controller/operations/bet/createBet'
import { DeleteBetOperator } from '@controller/operations/bet/deleteBet'
import { FindAllBetOperator } from '@controller/operations/bet/findAllBet'
import { FindOneBetOperator } from '@controller/operations/bet/findOneBet'
import { UpdateBetOperator } from '@controller/operations/bet/updateBet'
import { CreateGameOperator } from '@controller/operations/game/createGame'
import { DeleteGameOperator } from '@controller/operations/game/deleteGame'
import { FindAllGamesOperator } from '@controller/operations/game/findAllGames'
import { FindOneGameOperator } from '@controller/operations/game/findOneGame'
import { UpdateGameOperator } from '@controller/operations/game/updateGame'
import { CreateUserAdminOperator } from '@controller/operations/user/createUserAdmin'
import { CreateUserPlayerOperator } from '@controller/operations/user/createUserPlayer'
import { DeleteUserOperator } from '@controller/operations/user/deleteUser'
import { FindAllUsersOperator } from '@controller/operations/user/findAllUsers'
import { FindOneUserOperator } from '@controller/operations/user/findOneUser'
import { RecoverPasswordOperator } from '@controller/operations/user/recoverPassword'
import { UpdatePasswordOperator } from '@controller/operations/user/updatePassword'
import { UpdateUserOperator } from '@controller/operations/user/updateUser'
import { ContainerModule, interfaces } from 'inversify'

export const operatorModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(CreateUserAdminOperator).to(CreateUserAdminOperator)
  bind(CreateUserPlayerOperator).to(CreateUserPlayerOperator)
  bind(DeleteUserOperator).to(DeleteUserOperator)
  bind(FindOneUserOperator).to(FindOneUserOperator)
  bind(FindAllUsersOperator).to(FindAllUsersOperator)
  bind(UpdateUserOperator).to(UpdateUserOperator)

  bind(CreateGameOperator).to(CreateGameOperator)
  bind(DeleteGameOperator).to(DeleteGameOperator)
  bind(FindOneGameOperator).to(FindOneGameOperator)
  bind(FindAllGamesOperator).to(FindAllGamesOperator)
  bind(UpdateGameOperator).to(UpdateGameOperator)

  bind(CreateBetOperator).to(CreateBetOperator)
  bind(DeleteBetOperator).to(DeleteBetOperator)
  bind(FindOneBetOperator).to(FindOneBetOperator)
  bind(FindAllBetOperator).to(FindAllBetOperator)
  bind(UpdateBetOperator).to(UpdateBetOperator)

  bind(CreateAccessProlfileOperator).to(CreateAccessProlfileOperator)
  bind(DeleteAccessProfileOperator).to(DeleteAccessProfileOperator)
  bind(FindOneAccessProfileOperator).to(FindOneAccessProfileOperator)
  bind(FindAllAccessProfileOperator).to(FindAllAccessProfileOperator)
  bind(UpdateAccessProfileOperator).to(UpdateAccessProfileOperator)

  bind(CreateAuthenticationOperator).to(CreateAuthenticationOperator)
  bind(RecoverPasswordOperator).to(RecoverPasswordOperator)
  bind(UpdatePasswordOperator).to(UpdatePasswordOperator)
})
