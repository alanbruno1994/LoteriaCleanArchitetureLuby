import setupBodyParser from '../middleware/body_paser'
import express from 'express'
import { routeAccessProfile, routeAuthProfile, routeBet, routeGame, routeUser } from '@framework/routers'

const app = express() // Aqui e instancia do express
setupBodyParser(app)
app.use(routeUser)
app.use(routeBet)
app.use(routeGame)
app.use(routeAccessProfile)
app.use(routeAuthProfile)
export default app
