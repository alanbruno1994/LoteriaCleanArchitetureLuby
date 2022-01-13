
import { Request, Response } from 'express'
import { container } from '@shared/ioc/container'
import { IError } from '@shared/iError'
import { RecoverPasswordOperator } from '@controller/operations/user/recoverPassword'
import { InputRecoverPassword } from '@controller/serializers/user/inputRecoverPassword'

export class RecoverPasswordOperatorAdapter {
  static async exec (req: Request,res: Response) {
    try {
      const operator = container.get(RecoverPasswordOperator)
      const input = new InputRecoverPassword(req.body)
      const recover = await operator.run(input)
      if (recover.isLeft()) {
        return res.status(recover.value.statusCode).send(recover.value.body)
      }
      res.status(200).send()
    } catch (error) {
      if (error instanceof IError) {
        return res.status(error.statusCode).send(error.body)
      }
      return res.status(500).send('Internal server error!')
    }
  }
}
