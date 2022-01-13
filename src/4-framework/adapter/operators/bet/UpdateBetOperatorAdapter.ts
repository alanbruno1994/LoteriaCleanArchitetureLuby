import { Request, Response } from 'express'
import { container } from '@shared/ioc/container'
import { IError } from '@shared/iError'
import { UpdateBetOperator } from '@controller/operations/bet/updateBet'
import { InputUpdateBet } from '@controller/serializers/bet/inputUpdateBet'

export class UpdateBetOperatorAdapter {
  static async exec (req: Request,res: Response) {
    try {
      const operator = container.get(UpdateBetOperator)
      const input = new InputUpdateBet(req.body)
      const token = ('' + req.headers.authorization).replace('Bearer ','')
      const bets = await operator.run(input,req.params.secure_id,token)
      if (bets.isLeft()) {
        return res.status(bets.value.statusCode).send(bets.value.body)
      }
      return res.status(200).send(bets.value)
    } catch (error) {
      if (error instanceof IError) {
        return res.status(error.statusCode).send(error.body)
      }
      return res.status(500).send('Internal server error!')
    }
  }
}
