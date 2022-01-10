import { Request, Response, Router } from 'express'
import '@framework/ioc/inversify.config'
import { container } from '@shared/ioc/container'
import { FindAllGamesOperator } from '@controller/operations/game/findAllGames'
import { FindOneGameOperator } from '@controller/operations/game/findOneGame'
import { InputByGame } from '@controller/serializers/game/inputByGame'
import { InputCreateGame } from '@controller/serializers/game/inputCreateGame'
import { UpdateGameOperator } from '@controller/operations/game/updateGame'
import { InputUpdateGame } from '@controller/serializers/game/inputUpdateGame'
import { DeleteGameOperator } from '@controller/operations/game/deleteGame'
import { InputDeleteGame } from '@controller/serializers/game/inputDeleteGame'
import { CreateGameOperator } from '@controller/operations/game/createGame'
import { IError } from '@shared/iError'
const routeGame = Router() // Aqui é usado para registrar as rotas

routeGame.get('/game', async (req: Request,res: Response) => {
  try {
    const operator = container.get(FindAllGamesOperator)
    const token = ('' + req.headers.authorization).replace('Bearer ','')
    const games = await operator.run(token)
    if (games.isLeft()) {
      return res.status(games.value.statusCode).send(games.value.body)
    }
    return res.status(201).send(games.value)
  } catch (error) {
    if (error instanceof IError) {
      return res.status(error.statusCode).send(error.body)
    }
    return res.status(500).send('Internal server error!')
  }
})

routeGame.get('/game/:secure_id', async (req: Request,res: Response) => {
  try {
    const operator = container.get(FindOneGameOperator)
    const input = new InputByGame({ secure_id: req.params.secure_id })
    const token = ('' + req.headers.authorization).replace('Bearer ','')
    const games = await operator.run(input,token)
    if (games.isLeft()) {
      return res.status(games.value.statusCode).send(games.value.body)
    }
    return res.status(200).send(games.value)
  } catch (error) {
    if (error instanceof IError) {
      return res.status(error.statusCode).send(error.body)
    }
    return res.status(500).send('Internal server error!')
  }
})

routeGame.post('/game', async (req: Request,res: Response) => {
  try {
    const operator = container.get(CreateGameOperator)
    const input = new InputCreateGame(req.body)
    const token = ('' + req.headers.authorization).replace('Bearer ','')
    const games = await operator.run(input,token)
    if (games.isLeft()) {
      return res.status(games.value.statusCode).send(games.value.body)
    }
    return res.status(201).send(games.value)
  } catch (error) {
    if (error instanceof IError) {
      return res.status(error.statusCode).send(error.body)
    }
    return res.status(500).send('Internal server error!')
  }
})

routeGame.put('/game/:secure_id', async (req: Request,res: Response) => {
  try {
    const operator = container.get(UpdateGameOperator)
    const input = new InputUpdateGame(req.body)
    const token = ('' + req.headers.authorization).replace('Bearer ','')
    const games = await operator.run(input,req.params.secure_id,token)
    if (games.isLeft()) {
      return res.status(games.value.statusCode).send(games.value.body)
    }
    return res.status(200).send(games.value)
  } catch (error) {
    if (error instanceof IError) {
      return res.status(error.statusCode).send(error.body)
    }
    return res.status(500).send('Internal server error!')
  }
})

routeGame.delete('/game/:secure_id', async (req: Request,res: Response) => {
  try {
    const operator = container.get(DeleteGameOperator)
    const input = new InputDeleteGame({ secure_id: req.params.secure_id })
    const token = ('' + req.headers.authorization).replace('Bearer ','')
    const games = await operator.run(input,token)
    if (games.isLeft()) {
      return res.status(games.value.statusCode).send(games.value.body)
    }
    return res.status(200).send(games.value)
  } catch (error) {
    if (error instanceof IError) {
      return res.status(error.statusCode).send(error.body)
    }
    return res.status(500).send('Internal server error!')
  }
})

export default routeGame
