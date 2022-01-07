import { Request, Response, Router } from 'express'
import '@framework/ioc/inversify.config'
import { container } from '@shared/ioc/container'
import { FindAllAccessProfileOperator } from '@controller/operations/access/findAllAccess'
import { FindOneAccessProfileOperator } from '@controller/operations/access/findOneAccess'
import { CreateAccessProlfileOperator } from '@controller/operations/access/createAccess'
import { InputByAccessProfile } from '@controller/serializers/access/inputByAccessProfile'
import { InputCreateAccessProfile } from '@controller/serializers/access/inputCreateAccessProfile'
import { UpdateAccessProfileOperator } from '@controller/operations/access/updateAccess'
import { DeleteAccessProfileOperator } from '@controller/operations/access/deleteAccess'
import { InputDeleteAccessProfile } from '@controller/serializers/access/inputDeleteAccessProfile'
import { InputUpdateAccessProfile } from '@controller/serializers/access/inputUpdateAccessProfile'
import { IError } from '@shared/iError'
const routeAccessProfile = Router() // Aqui é usado para registrar as rotas

routeAccessProfile.get('/access', async (_req: Request,res: Response) => {
  try {
    const operator = container.get(FindAllAccessProfileOperator)
    const accesss = await operator.run()
    if (accesss.isLeft()) {
      return res.status(accesss.value.statusCode).send(accesss.value.body)
    }
    return res.status(201).send(accesss)
  } catch (error) {
    if (error instanceof IError) {
      return res.status(error.statusCode).send(error.body)
    }
    return res.status(500).send('Internal server error!')
  }
})

routeAccessProfile.get('/access/:secureId', async (req: Request,res: Response) => {
  try {
    const operator = container.get(FindOneAccessProfileOperator)
    const input = new InputByAccessProfile({ secure_id: req.params.secureId })
    const accesss = await operator.run(input)
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
})

routeAccessProfile.post('/access', async (req: Request,res: Response) => {
  try {
    const operator = container.get(CreateAccessProlfileOperator)
    const input = new InputCreateAccessProfile(req.body)
    const accesss = await operator.run(input)
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
})

routeAccessProfile.put('/access/:secure_id', async (req: Request,res: Response) => {
  try {
    const operator = container.get(UpdateAccessProfileOperator)
    const input = new InputUpdateAccessProfile(req.body)
    const accesss = await operator.run(input,req.params.secure_id)
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
})

routeAccessProfile.delete('/access/:secure_id', async (req: Request,res: Response) => {
  try {
    const operator = container.get(DeleteAccessProfileOperator)
    const input = new InputDeleteAccessProfile({ secure_id: req.params.secure_id })
    const accesss = await operator.run(input)
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
})

export default routeAccessProfile
