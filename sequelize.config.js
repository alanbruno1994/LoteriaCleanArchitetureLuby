require('dotenv').config()

const STAGE = process.env.STAGE ?? 'dev'
let config = {
  host: STAGE === 'test' ? process.env.DB_TEST_HOST : process.env.DB_HOST,
  port: STAGE === 'test' ? process.env.DB_TEST_PORT : process.env.DB_PORT,
  username: STAGE === 'test' ? process.env.DB_TEST_USER : process.env.DB_USER,
  password: STAGE === 'test' ? process.env.DB_TEST_PASSWORD : process.env.DB_PASSWORD,
  database: STAGE === 'test' ? process.env.DB_TEST_NAME : process.env.DB_NAME,
  dialect: STAGE === 'test' ? process.env.DB_TEST_DIALECT : process.env.DB_DIALECT
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
