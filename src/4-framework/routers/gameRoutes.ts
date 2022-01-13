import { Router } from 'express'
import '@framework/ioc/inversify.config'
import { CreateGameOperatorAdapter, DeleteGameOperatorAdapter, FindAllGamesOperatorAdapter, FindOneGameOperatorAdapter, UpdateGameOperatorAdapter } from '@framework/adapter/operators/games'

const routeGame = Router() // Aqui é usado para registrar as rotas

routeGame.get('/game', FindAllGamesOperatorAdapter.exec)

routeGame.get('/game/:secure_id',FindOneGameOperatorAdapter.exec)

routeGame.post('/game',CreateGameOperatorAdapter.exec)

routeGame.put('/game/:secure_id', UpdateGameOperatorAdapter.exec)

routeGame.delete('/game/:secure_id',DeleteGameOperatorAdapter.exec)

export default routeGame
