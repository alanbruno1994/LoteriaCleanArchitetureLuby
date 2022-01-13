import { Router } from 'express'
import '@framework/ioc/inversify.config'
import { CreateUserAdminOperatorAdapter, CreateUserPlayerOperatorAdapter, DeleteUserOperatorAdapter, FindAllUsersOperatorAdapter, FindOneUserOperatorAdapter, RecoverPasswordOperatorAdapter, UpdatePasswordOperatorAdapter, UpdateUserOperatorAdapter } from '@framework/adapter/operators/users'

const routeUser = Router() // Aqui é usado para registrar as rotas

routeUser.get('/user', FindAllUsersOperatorAdapter.exec)

routeUser.get('/user/:secureId', FindOneUserOperatorAdapter.exec)

routeUser.post('/user/admin',CreateUserAdminOperatorAdapter.exec)

routeUser.post('/user/player',CreateUserPlayerOperatorAdapter.exec)

routeUser.put('/user/:secure_id', UpdateUserOperatorAdapter.exec)

routeUser.delete('/user/:secure_id', DeleteUserOperatorAdapter.exec)

routeUser.post('/user/recover_password',RecoverPasswordOperatorAdapter.exec)

routeUser.post('/user/update_password/:token',UpdatePasswordOperatorAdapter.exec)

export default routeUser
