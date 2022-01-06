import express from 'express'
const setupBodyParser = (app: any): void => {
  app.use(express.json()) // Aqui está configurando o body-parse
}
export default setupBodyParser
