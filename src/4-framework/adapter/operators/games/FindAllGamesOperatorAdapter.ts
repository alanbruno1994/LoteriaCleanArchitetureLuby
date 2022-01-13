
import { Request, Response } from 'express'
import { container } from '@shared/ioc/container'
import { IError } from '@shared/iError'
import { FindAllGamesOperator } from '@controller/operations/game/findAllGames'

export class FindAllGamesOperatorAdapter {
  static async exec (req: Request,res: Response) {
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
  }
}
