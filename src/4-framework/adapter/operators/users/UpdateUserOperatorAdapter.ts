
import { Request, Response } from 'express'
import { container } from '@shared/ioc/container'
import { IError } from '@shared/iError'
import { UpdateUserOperator } from '@controller/operations/user/updateUser'
import { InputUpdateUser } from '@controller/serializers/user/inputUpdateUser'

export class UpdateUserOperatorAdapter {
  static async exec (req: Request,res: Response) {
    try {
      const operator = container.get(UpdateUserOperator)
      const input = new InputUpdateUser(req.body)
      const token = ('' + req.headers.authorization).replace('Bearer ','')
      const users: any = await operator.run(input,req.params.secure_id,token)
      if (users.isLeft()) {
        return res.status(users.value.statusCode).send(users.value.body)
      }
      return res.status(201).send(users.value)
    } catch (error) {
      if (error instanceof IError) {
        return res.status(error.statusCode).send(error.body)
      }
      console.log(error)
      return res.status(500).send({ msg: 'Internal server error!' })
    }
  }
}
