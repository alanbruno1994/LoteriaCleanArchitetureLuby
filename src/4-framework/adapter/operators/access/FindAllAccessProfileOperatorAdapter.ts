
import { Request, Response } from 'express'
import { container } from '@shared/ioc/container'
import { IError } from '@shared/iError'
import { FindAllAccessProfileOperator } from '@controller/operations/access/findAllAccess'

export class FindAllAccessProfileOperatorAdapter {
  static async exec (req: Request,res: Response) {
    try {
      const operator = container.get(FindAllAccessProfileOperator)
      const token = ('' + req.headers.authorization).replace('Bearer ','')
      const accesss = await operator.run(token,!!req.query.all)
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
