import { Router } from 'express'
import '@framework/ioc/inversify.config'
import { DeleteBetOperatorAdapter } from '@framework/adapter/operators/bet/DeleteBetOperatorAdapter'
const routeAuthProfile = Router() // Aqui é usado para registrar as rotas

routeAuthProfile.post('/login',DeleteBetOperatorAdapter.exec)

export default routeAuthProfile
