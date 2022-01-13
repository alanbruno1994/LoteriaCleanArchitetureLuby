
import { Request, Response } from 'express'
import { container } from '@shared/ioc/container'
import { IError } from '@shared/iError'
import { FindOneUserOperator } from '@controller/operations/user/findOneUser'
import { InputByUser } from '@controller/serializers/user/inputByUser'

export class FindOneUserOperatorAdapter {
  static async exec (req: Request,res: Response) {
    try {
      const operator = container.get(FindOneUserOperator)
      const input = new InputByUser({ secure_id: req.params.secureId })
      const token = ('' + req.headers.authorization).replace('Bearer ','')
      const users: any = await operator.run(input,token)
      if (users.isLeft()) {
        return res.status(users.value.statusCode).send(users.value.body)
      }
      return res.status(200).send({ ...users.value,password: null })
    } catch (error) {
      if (error instanceof IError) {
        return res.status(error.statusCode).send(error.body)
      }
      return res.status(500).send('Internal server error!')
    }
  }
}
