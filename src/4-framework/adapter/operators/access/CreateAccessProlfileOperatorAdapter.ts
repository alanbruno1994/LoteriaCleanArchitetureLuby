
import { Request, Response } from 'express'
import { container } from '@shared/ioc/container'
import { IError } from '@shared/iError'
import { CreateAccessProlfileOperator } from '@controller/operations/access/createAccess'
import { InputCreateAccessProfile } from '@controller/serializers/access/inputCreateAccessProfile'

export class CreateAccessProlfileOperatorAdapter {
  static async exec (req: Request,res: Response) {
    try {
      const operator = container.get(CreateAccessProlfileOperator)
      const input = new InputCreateAccessProfile(req.body)
      const token = ('' + req.headers.authorization).replace('Bearer ','')
      const accesss = await operator.run(input,token)
      if (accesss.isLeft()) {
        return res.status(accesss.value.statusCode).send(accesss.value.body)
      }
      return res.status(200).send(accesss.value)
    } catch (error) {
      if (error instanceof IError) {
        return res.status(error.statusCode).send(error.body)
      }
      console.log(error)
      return res.status(500).send('Internal server error!')
    }
  }
}
