
import { Request, Response } from 'express'
import { container } from '@shared/ioc/container'
import { IError } from '@shared/iError'
import { FindOneAccessProfileOperator } from '@controller/operations/access/findOneAccess'
import { InputByAccessProfile } from '@controller/serializers/access/inputByAccessProfile'

export class FindOneAccessProfileOperatorAdapter {
  static async exec (req: Request,res: Response) {
    try {
      const operator = container.get(FindOneAccessProfileOperator)
      const input = new InputByAccessProfile({ secure_id: req.params.secureId })
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
      return res.status(500).send('Internal server error!')
    }
  }
}
