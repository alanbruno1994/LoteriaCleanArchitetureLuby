
import setupBodyParser from '../middleware/body_paser'
import routeUser from '../routers/userRoutes'
import express from 'express'
const app = express() // Aqui e instancia do express
setupBodyParser(app)
app.use(routeUser)
export default app
