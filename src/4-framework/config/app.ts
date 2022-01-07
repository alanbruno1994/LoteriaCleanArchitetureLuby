import setupBodyParser from '../middleware/body_paser'
import routeUser from '../routers/userRoutes'
import express from 'express'
import routeBet from '@framework/routers/betRoutes'
import routeGame from '@framework/routers/gameRoutes'
import routeAccessProfile from '@framework/routers/accessProfileRoute'
import routeAuthProfile from '@framework/routers/authRoute'
const app = express() // Aqui e instancia do express
setupBodyParser(app)
app.use(routeUser)
app.use(routeBet)
app.use(routeGame)
app.use(routeAccessProfile)
app.use(routeAuthProfile)
export default app
