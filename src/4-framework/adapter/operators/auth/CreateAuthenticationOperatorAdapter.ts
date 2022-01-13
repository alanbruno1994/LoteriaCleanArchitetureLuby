import { Request, Response } from 'express'
import { container } from '@shared/ioc/container'
import { IError } from '@shared/iError'
import { CreateAuthenticationOperator } from '@controller/operations/authentication/createAuthentication'

export class DeleteBetOperatorAdapter {
  static async exec (req: Request,res: Response) {
    try {
      const operator = container.get(CreateAuthenticationOperator)
      const accesss = await operator.run(req.body)
      if (accesss.isLeft()) {
        return res.status(accesss.value.statusCode).send(accesss.value.body)
      }
      return res.status(200).send(accesss.value)
    } catch (error) {
      if (error instanceof IError) {
        return res.status(error.statusCode).send(error.body)
      }
      console.log(error)
      return res.status(500).send({ msg: 'Internal server error!' })
    }
  }
}
