require('dotenv').config()

const STAGE = process.env.STAGE ?? 'dev'

let config = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '12345',
  database: process.env.DB_NAME || 'serverless',
  dialect: process.env.DB_DIALECT
}

if (['prod', 'production'].includes(STAGE.toLocaleLowerCase())) {
  config = {
    host: process.env.PROD_MYSQL_HOST,
    port: process.env.PROD_MYSQL_PORT,
    username: process.env.PROD_MYSQL_USER,
    password: process.env.PROD_MYSQL_PASS,
    database: process.env.PROD_MYSQL_NAME,
    dialect: process.env.DB_DIALECT
  }
}

module.exports = config
