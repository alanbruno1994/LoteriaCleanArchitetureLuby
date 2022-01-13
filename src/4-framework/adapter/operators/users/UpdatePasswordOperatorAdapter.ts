
import { Request, Response } from 'express'
import { container } from '@shared/ioc/container'
import { IError } from '@shared/iError'
import { UpdatePasswordOperator } from '@controller/operations/user/updatePassword'
import { InputUpdatePassword } from '@controller/serializers/user/inputUpdatePassword'

export class UpdatePasswordOperatorAdapter {
  static async exec (req: Request,res: Response) {
    try {
      const operator = container.get(UpdatePasswordOperator)
      const input = new InputUpdatePassword({ password: req.body.password, tokenRecover: req.params.token })
      const recover = await operator.run(input)
      if (recover?.isLeft()) {
        return res.status(recover.value.statusCode).send(recover.value.body)
      }
      res.status(200).send()
    } catch (error) {
      if (error instanceof IError) {
        return res.status(error.statusCode).send(error.body)
      }
      console.log(error)
      return res.status(500).send({ msg: 'Internal server error!' })
    }
  }
}
