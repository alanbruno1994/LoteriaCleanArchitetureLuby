
import { Request, Response } from 'express'
import { container } from '@shared/ioc/container'
import { IError } from '@shared/iError'
import { DeleteGameOperator } from '@controller/operations/game/deleteGame'
import { InputDeleteGame } from '@controller/serializers/game/inputDeleteGame'

export class DeleteGameOperatorAdapter {
  static async exec (req: Request,res: Response) {
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
  }
}
