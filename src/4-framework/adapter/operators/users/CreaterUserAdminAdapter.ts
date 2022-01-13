
import { Request, Response } from 'express'
import { CreateUserAdminOperator } from '@controller/operations/user/createUserAdmin'
import { InputCreateUser } from '@controller/serializers/user/inputCreateUser'
import { container } from '@shared/ioc/container'
import { IError } from '@shared/iError'

export class CreateUserAdminOperatorAdapter {
  static async exec (req: Request,res: Response) {
    try {
      const operator = container.get(CreateUserAdminOperator)
      const input = new InputCreateUser(req.body)
      const token = ('' + req.headers.authorization).replace('Bearer ','')
      const users: any = await operator.run(input,token)
      if (users.isLeft()) {
        return res.status(users.value.statusCode).send(users.value.body)
      }
      return res.status(201).send(users.value)
    } catch (error) {
      if (error instanceof IError) {
        return res.status(error.statusCode).send(error.body)
      }
      console.log(error)
      return res.status(500).send('Internal server error!')
    }
  }
}
