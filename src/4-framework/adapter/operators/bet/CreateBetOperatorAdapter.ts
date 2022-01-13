import { Request, Response } from 'express'
import { container } from '@shared/ioc/container'
import { IError } from '@shared/iError'
import { CreateBetOperator } from '@controller/operations/bet/createBet'
import { InputCreateBet } from '@controller/serializers/bet/inputCreateBet'

export class CreateBetOperatorAdapter {
  static async exec (req: Request,res: Response) {
    try {
      const operator = container.get(CreateBetOperator)
      const input = new InputCreateBet(req.body)
      const token = ('' + req.headers.authorization).replace('Bearer ','')
      const bets = await operator.run(input,token)
      if (bets.isLeft()) {
        return res.status(bets.value.statusCode).send(bets.value.body)
      }
      return res.status(201).send(bets.value)
    } catch (error) {
      if (error instanceof IError) {
        return res.status(error.statusCode).send(error.body)
      }
      return res.status(500).send('Internal server error!')
    }
  }
}
