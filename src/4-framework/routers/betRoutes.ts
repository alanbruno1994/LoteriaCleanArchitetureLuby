import { Router } from 'express'
import '@framework/ioc/inversify.config'
import { CreateBetOperatorAdapter, DeleteBetOperatorAdapter, FindAllBetOperatorAdapter, FindOneBetOperatorAdapter, UpdateBetOperatorAdapter } from '@framework/adapter/operators/bet'
const routeBet = Router() // Aqui é usado para registrar as rotas

routeBet.get('/bet', FindAllBetOperatorAdapter.exec)

routeBet.get('/bet/:secure_id', FindOneBetOperatorAdapter.exec)

routeBet.post('/bet',CreateBetOperatorAdapter.exec)

routeBet.put('/bet/:secure_id', UpdateBetOperatorAdapter.exec)

routeBet.delete('/bet/:secure_id',DeleteBetOperatorAdapter.exec)

export default routeBet
