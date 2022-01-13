
import { Request, Response } from 'express'
import { container } from '@shared/ioc/container'
import { IError } from '@shared/iError'
import { UpdateAccessProfileOperator } from '@controller/operations/access/updateAccess'
import { InputUpdateAccessProfile } from '@controller/serializers/access/inputUpdateAccessProfile'

export class UpdateAccessProfileOperatorAdapter {
  static async exec (req: Request,res: Response) {
    try {
      const operator = container.get(UpdateAccessProfileOperator)
      const input = new InputUpdateAccessProfile(req.body)
      const token = ('' + req.headers.authorization).replace('Bearer ','')
      const accesss = await operator.run(input,req.params.secure_id,token)
      if (accesss.isLeft()) {
        return res.status(accesss.value.statusCode).send(accesss.value.body)
      }
      return res.status(200).send(accesss.value)
    } catch (error) {
      if (error instanceof IError) {
        return res.status(error.statusCode).send(error.body)
      }
      return res.status(500).send('Internal server error!')
    }
  }
}
