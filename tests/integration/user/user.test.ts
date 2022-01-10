/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { CreateAccessProfileUseCase } from '@business/useCases/access/createAccessProfileUseCase'
import { CreateGameUseCase } from '@business/useCases/game/createGameUseCase'
import { CreateUserUseCase } from '@business/useCases/user/createUserUseCase'
import app from '@framework/config/app'
import '@framework/ioc/inversify.config'
import { container } from '@shared/ioc/container'
import supertest from 'supertest'
const shell = require('shelljs')
jest.setTimeout(10000)
let token = ''
let secureId = ''
async function execAsync (cmd, opts = {}): Promise<unknown> {
  return new Promise(function (resolve, reject) {
    // Execute the command, reject if we exit non-zero (i.e. error)
    shell.exec(cmd, opts, function (code) {
      if (code !== 0) return reject(false)
      return resolve(true)
    })
  })
}

async function intialData (): Promise<void> {
  const createAccess = container.get(CreateAccessProfileUseCase)
  await createAccess.exec({ level: 'admin' })
  await createAccess.exec({ level: 'player' })
  const createUser = container.get(CreateUserUseCase)
  await createUser.exec({ access_profile_id: 1, name: 'fake name', password: '123abc45',email: 'fakeAdmin@gmail.com' })
  const createGame = container.get(CreateGameUseCase)
  await createGame.exec({ type: 'Mega Sena', price: 2.5 , color: 'red', max_number: 6, range: 60 })
  await createGame.exec({ type: 'Quina', price: 1.5 , color: 'red', max_number: 5, range: 80 })
  await createGame.exec({ type: 'Loto', price: 3.5 , color: 'red', max_number: 15, range: 25 })
}

describe('Teste User Integration',() => {
  beforeAll(async () => {
    await execAsync('yarn sequelize-cli db:migrate',{ async: true })
  })

  beforeAll(async () => {
    await intialData()
    process.env.PORT_TEST = '8888'
  })

  afterAll(async () => {
    await execAsync('yarn sequelize-cli db:migrate:undo',{ async: true })
    await execAsync('yarn sequelize-cli db:migrate:undo',{ async: true })
    await execAsync('yarn sequelize-cli db:migrate:undo',{ async: true })
    await execAsync('yarn sequelize-cli db:migrate:undo',{ async: true })
  })

  it('Login Admin',async () => {
    const response = await supertest(app)
      .post('/login').send({ email: 'fakeAdmin@gmail.com',password: '123abc45' })
    token = response.body.token
    expect(response.statusCode).toBe(200)
    expect(token).not.toBe('')
  })

  it('Return All Data With One Result',async () => {
    const response = await supertest(app)
      .get('/user').set({ Authorization: 'Bearer ' + token })
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBe(1)
  })

  it('Register Three Users',async () => {
    let response = await supertest(app)
      .post('/user/player').send({
        name: 'Ricardo Oliveira da Silva', password: '123abc45',email: 'ricardo@gmail.com'
      })
    secureId = response.body.secure_id
    expect(response.body.id).toBe(2)
    expect(response.body.name).toBe('Ricardo Oliveira da Silva')
    expect(response.body.email).toBe('ricardo@gmail.com')
    expect(response.statusCode).toBe(201)
    response = await supertest(app)
      .post('/user/player').send({
        name: 'Murilo Oliveira da Silva', password: '123abc45',email: 'oliveira@gmail.com'
      })
    expect(response.body.id).toBe(3)
    expect(response.body.name).toBe('Murilo Oliveira da Silva')
    expect(response.body.email).toBe('oliveira@gmail.com')
    expect(response.statusCode).toBe(201)
    response = await supertest(app)
      .post('/user/player').send({
        name: 'Carlos Oliveira da Silva', password: '123abc45',email: 'carlos@gmail.com'
      })
    expect(response.body.id).toBe(4)
    expect(response.body.name).toBe('Carlos Oliveira da Silva')
    expect(response.body.email).toBe('carlos@gmail.com')
    expect(response.statusCode).toBe(201)
  })

  it('Return All Data With Four Results',async () => {
    const response = await supertest(app)
      .get('/user').set({ Authorization: 'Bearer ' + token })
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBe(4)
  })

  it('Delete One User',async () => {
    const response = await supertest(app)
      .delete('/user/' + secureId).set({ Authorization: 'Bearer ' + token })
    expect(response.statusCode).toBe(200)
    expect(response.body.id).toBe(2)
    expect(response.body.name).toBe('Ricardo Oliveira da Silva')
    expect(response.body.email).toBe('ricardo@gmail.com')
  })

  it('Return All Data With Three Results',async () => {
    const response = await supertest(app)
      .get('/user').set({ Authorization: 'Bearer ' + token })
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBe(3)
  })
})
