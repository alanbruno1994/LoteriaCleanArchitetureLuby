/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-duplicates */
import express from 'express'
import { Router, Request, Response } from 'express' // O Request e Response sao tipagens
const db = require('./database/models')
require('dotenv').config()
const app = express() // Aqui e instancia do express
const route = Router() // Aqui é usado para registrar as rotas
app.use(express.json()) // Aqui está configurando o body-parse
route.get('/', (req: Request, res: Response) => {
  res.json({ message: 'hello world with Typescript' })
})
app.use(route) // Aqui seta as rotas registradas
db.sequelize.sync().then(() => { // sincronizar automaticamente todos os modelos
  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  app.listen(process.env.PORT, () => 'server running on port ' + process.env.PORT)
})
