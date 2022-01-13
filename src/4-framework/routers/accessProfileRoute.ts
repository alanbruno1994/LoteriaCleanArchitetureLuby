/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Router } from 'express'
import '@framework/ioc/inversify.config'
import { CreateAccessProlfileOperatorAdapter, DeleteAccessProfileOperatorAdapter, FindAllAccessProfileOperatorAdapter, FindOneAccessProfileOperatorAdapter, UpdateAccessProfileOperatorAdapter } from '@framework/adapter/operators/access'
const routeAccessProfile = Router() // Aqui é usado para registrar as rotas

routeAccessProfile.get('/access',FindAllAccessProfileOperatorAdapter.exec)

routeAccessProfile.get('/access/:secureId',FindOneAccessProfileOperatorAdapter.exec)

routeAccessProfile.post('/access', CreateAccessProlfileOperatorAdapter.exec)

routeAccessProfile.put('/access/:secure_id', UpdateAccessProfileOperatorAdapter.exec)

routeAccessProfile.delete('/access/:secure_id',DeleteAccessProfileOperatorAdapter.exec)

export default routeAccessProfile
