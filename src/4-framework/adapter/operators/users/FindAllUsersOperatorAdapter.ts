
import { Request, Response } from 'express'
import { container } from '@shared/ioc/container'
import { IError } from '@shared/iError'
import { FindAllUsersOperator } from '@controller/operations/user/findAllUsers'

export class FindAllUsersOperatorAdapter {
  static async exec (req: Request,res: Response) {
    try {
      const operator = container.get(FindAllUsersOperator)
      const token = ('' + req.headers.authorization).replace('Bearer ','')
      const users = await operator.run(token,!!req.query.all)
      if (users.isLeft()) {
        return res.status(users.value.statusCode).send(users.value.body)
      }
      res.status(200).send(users.value)
    } catch (error) {
      console.log(error)
      if (error instanceof IError) {
        return res.status(error.statusCode).send(error.body)
      }
      return res.status(500).send('Internal server error!')
    }
  }
}
