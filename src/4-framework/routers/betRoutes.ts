import { Request, Response, Router } from 'express'
import '@framework/ioc/inversify.config'
import { container } from '@shared/ioc/container'
import { FindAllBetOperator } from '@controller/operations/bet/findAllBet'
import { FindOneBetOperator } from '@controller/operations/bet/findOneBet'
import { InputByBet } from '@controller/serializers/bet/inputByBet'
import { InputCreateBet } from '@controller/serializers/bet/inputCreateBet'
import { UpdateBetOperator } from '@controller/operations/bet/updateBet'
import { InputUpdateBet } from '@controller/serializers/bet/inputUpdateBet'
import { DeleteBetOperator } from '@controller/operations/bet/deleteBet'
import { InputDeleteBet } from '@controller/serializers/bet/inputDeleteBet'
import { CreateBetOperator } from '@controller/operations/bet/createBet'
import { IError } from '@shared/iError'
const routeBet = Router() // Aqui é usado para registrar as rotas

routeBet.get('/bet', async (req: Request,res: Response) => {
  try {
    const operator = container.get(FindAllBetOperator)
    const token = ('' + req.headers.authorization).replace('Bearer ','')
    const bets = await operator.run(token)
    if (bets.isLeft()) {
      return res.status(bets.value.statusCode).send(bets.value.body)
    }
    return res.status(200).send(bets.value)
  } catch (error) {
    if (error instanceof IError) {
      return res.status(error.statusCode).send(error.body)
    }
    return res.status(500).send('Internal server error!')
  }
})

routeBet.get('/bet/:secure_id', async (req: Request,res: Response) => {
  try {
    const operator = container.get(FindOneBetOperator)
    const input = new InputByBet({ secure_id: req.params.secure_id })
    const token = ('' + req.headers.authorization).replace('Bearer ','')
    const bets = await operator.run(input,token)
    if (bets.isLeft()) {
      return res.status(bets.value.statusCode).send(bets.value.body)
    }
    return res.status(200).send(bets.value)
  } catch (error) {
    if (error instanceof IError) {
      return res.status(error.statusCode).send(error.body)
    }
    return res.status(500).send('Internal server error!')
  }
})

routeBet.post('/bet', async (req: Request,res: Response) => {
  try {
    const operator = container.get(CreateBetOperator)
    const input = new InputCreateBet(req.body)
    const token = ('' + req.headers.authorization).replace('Bearer ','')
    const bets = await operator.run(input,token)
    if (bets.isLeft()) {
      return res.status(bets.value.statusCode).send(bets.value.body)
    }
    return res.status(201).send(bets.value)
  } catch (error) {
    if (error instanceof IError) {
      return res.status(error.statusCode).send(error.body)
    }
    return res.status(500).send('Internal server error!')
  }
})

routeBet.put('/bet/:secure_id', async (req: Request,res: Response) => {
  try {
    const operator = container.get(UpdateBetOperator)
    const input = new InputUpdateBet(req.body)
    const token = ('' + req.headers.authorization).replace('Bearer ','')
    const bets = await operator.run(input,req.params.secure_id,token)
    if (bets.isLeft()) {
      return res.status(bets.value.statusCode).send(bets.value.body)
    }
    return res.status(200).send(bets.value)
  } catch (error) {
    if (error instanceof IError) {
      return res.status(error.statusCode).send(error.body)
    }
    return res.status(500).send('Internal server error!')
  }
})

routeBet.delete('/bet/:secure_id', async (req: Request,res: Response) => {
  try {
    const operator = container.get(DeleteBetOperator)
    const input = new InputDeleteBet({ secure_id: req.params.secure_id })
    const token = ('' + req.headers.authorization).replace('Bearer ','')
    const bets = await operator.run(input,token)
    if (bets.isLeft()) {
      return res.status(bets.value.statusCode).send(bets.value.body)
    }
    return res.status(200).send(bets.value)
  } catch (error) {
    if (error instanceof IError) {
      return res.status(error.statusCode).send(error.body)
    }
    return res.status(500).send('Internal server error!')
  }
})

export default routeBet
