
import { Request, Response } from 'express'
import { container } from '@shared/ioc/container'
import { IError } from '@shared/iError'
import { DeleteUserOperator } from '@controller/operations/user/deleteUser'
import { InputDeleteUser } from '@controller/serializers/user/inputDeleteUser'

export class DeleteUserOperatorAdapter {
  static async exec (req: Request,res: Response) {
    try {
      const operator = container.get(DeleteUserOperator)
      const input = new InputDeleteUser({ secure_id: req.params.secure_id })
      const token = ('' + req.headers.authorization).replace('Bearer ','')
      const users = await operator.run(input,token)
      if (users.isLeft()) {
        return res.status(users.value.statusCode).send(users.value.body)
      }
      res.status(200).send(users.value)
    } catch (error) {
      if (error instanceof IError) {
        return res.status(error.statusCode).send(error.body)
      }
      return res.status(500).send('Internal server error!')
    }
  }
}
