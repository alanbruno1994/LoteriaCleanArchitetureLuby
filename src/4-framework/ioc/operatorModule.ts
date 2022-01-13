import { CreateAccessProlfileOperator, DeleteAccessProfileOperator, FindAllAccessProfileOperator, FindOneAccessProfileOperator, UpdateAccessProfileOperator } from '@controller/operations/access'
import { CreateAuthenticationOperator } from '@controller/operations/authentication/createAuthentication'
import { CreateBetOperator, DeleteBetOperator, FindAllBetOperator, FindOneBetOperator, UpdateBetOperator } from '@controller/operations/bet'
import { CreateGameOperator, DeleteGameOperator, FindAllGamesOperator, FindOneGameOperator, UpdateGameOperator } from '@controller/operations/game'
import { CreateUserAdminOperator, CreateUserPlayerOperator, DeleteUserOperator, FindAllUsersOperator, FindOneUserOperator, RecoverPasswordOperator, UpdatePasswordOperator, UpdateUserOperator } from '@controller/operations/user'
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
