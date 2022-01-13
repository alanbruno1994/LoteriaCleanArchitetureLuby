
import { Request, Response } from 'express'
import { InputCreateUser } from '@controller/serializers/user/inputCreateUser'
import { container } from '@shared/ioc/container'
import { IError } from '@shared/iError'
import { CreateUserPlayerOperator } from '@controller/operations/user/createUserPlayer'

export class CreateUserPlayerOperatorAdapter {
  static async exec (req: Request,res: Response) {
    try {
      const operator = container.get(CreateUserPlayerOperator)
      const input = new InputCreateUser(req.body)
      const users: any = await operator.run(input)
      if (users.isLeft()) {
        return res.status(users.value.statusCode).send(users.value.body)
      }
      return res.status(201).send(users.value)
    } catch (error) {
      if (error instanceof IError) {
        return res.status(error.statusCode).send(error.body)
      }
      return res.status(500).send('Internal server error!')
    }
  }
}
