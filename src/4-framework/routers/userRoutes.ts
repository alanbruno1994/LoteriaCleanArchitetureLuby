import { Request, Response, Router } from 'express'
import '@framework/ioc/inversify.config'
import { container } from '@shared/ioc/container'
import { FindAllUsersOperator } from '@controller/operations/user/findAllUsers'
import { FindOneUserOperator } from '@controller/operations/user/findOneUser'
import { InputByUser } from '@controller/serializers/user/inputByUser'
import { CreateUserAdminOperator } from '@controller/operations/user/createUserAdmin'
import { InputCreateUser } from '@controller/serializers/user/inputCreateUser'
import { CreateUserPlayerOperator } from '@controller/operations/user/createUserPlayer'
import { UpdateUserOperator } from '@controller/operations/user/updateUser'
import { InputUpdateUser } from '@controller/serializers/user/inputUpdateUser'
import { DeleteUserOperator } from '@controller/operations/user/deleteUser'
import { InputDeleteUser } from '@controller/serializers/user/inputDeleteUser'
import { IError } from '@shared/iError'
const routeUser = Router() // Aqui é usado para registrar as rotas

routeUser.get('/user', async (_req: Request,res: Response) => {
  try {
    const operator = container.get(FindAllUsersOperator)
    const users = await operator.run()
    if (users.isLeft()) {
      return res.status(users.value.statusCode).send(users.value.body)
    }
    res.status(200).send(users.value)
  } catch (error) {
    if (error instanceof IError) {
      return res.status(error.statusCode).send(error.body)
    }
    return res.status(500).send('Internal server error!')
  }
})

routeUser.get('/user/:secureId', async (req: Request,res: Response) => {
  try {
    const operator = container.get(FindOneUserOperator)
    const input = new InputByUser({ secure_id: req.params.secureId })
    const users: any = await operator.run(input)
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
})

routeUser.post('/user/admin', async (req: Request,res: Response) => {
  try {
    const operator = container.get(CreateUserAdminOperator)
    const input = new InputCreateUser(req.body)
    const users: any = await operator.run(input)
    if (users.isLeft()) {
      return res.status(users.value.statusCode).send(users.value.body)
    }
    return res.status(201).send(users.value)
  } catch (error) {
    if (error instanceof IError) {
      return res.status(error.statusCode).send(error.body)
    }
    console.log(error)
    return res.status(500).send('Internal server error!')
  }
})

routeUser.post('/user/player', async (req: Request,res: Response) => {
  try {
    const operator = container.get(CreateUserPlayerOperator)

    const input = new InputCreateUser(req.body)
    const users: any = await operator.run(input)
    if (users.isLeft()) {
      return res.status(users.value.statusCode).send(users.value.body)
    }
    return res.status(201).send(users.value)
  } catch (error) {
    if (error instanceof IError) {
      return res.status(error.statusCode).send(error.body)
    }
    return res.status(500).send('Internal server error!')
  }
})

routeUser.put('/user/:secure_id', async (req: Request,res: Response) => {
  try {
    const operator = container.get(UpdateUserOperator)
    const input = new InputUpdateUser(req.body)
    const users: any = await operator.run(input,req.params.secure_id)
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
})

routeUser.delete('/user/:secure_id', async (req: Request,res: Response) => {
  try {
    const operator = container.get(DeleteUserOperator)
    const input = new InputDeleteUser({ secure_id: req.params.secure_id })
    const users = await operator.run(input)
    if (users.isLeft()) {
      return res.status(users.value.statusCode).send(users.value.body)
    }
    res.status(200).send(users.value)
  } catch (error) {
    if (error instanceof IError) {
      return res.status(error.statusCode).send(error.body)
    }
    return res.status(500).send('Internal server error!')
  }
})

export default routeUser
