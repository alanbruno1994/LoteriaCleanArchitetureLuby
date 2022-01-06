import { Router } from 'express'
import '@framework/ioc/inversify.config'
import { container } from '@shared/ioc/container'
import { FindAllUsersOperator } from '@controller/operations/user/findAllUsers'
const routeUser = Router() // Aqui é usado para registrar as rotas
/* (req: Request, res: Response) */
routeUser.get('/user', _ => {
  const operator = container.get(FindAllUsersOperator)
  console.log(operator)
})

export default routeUser
