
import { Request, Response } from 'express'
import { container } from '@shared/ioc/container'
import { IError } from '@shared/iError'
import { UpdateGameOperator } from '@controller/operations/game/updateGame'
import { InputUpdateGame } from '@controller/serializers/game/inputUpdateGame'

export class UpdateGameOperatorAdapter {
  static async exec (req: Request,res: Response) {
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
  }
}
