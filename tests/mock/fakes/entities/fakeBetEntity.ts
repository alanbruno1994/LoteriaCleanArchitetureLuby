import { IInputCreateBetDto } from '@business/dto/bet/create'
import { IBetEntity, InputBetEntity } from '@domain/entities/betEntity'

export const fakeCreatedBetEntity: InputBetEntity = {
  priceGame: 2.5,
  numbeChoose: '03,12,20,35,40,50'
}

export const fakeNewBet: IInputCreateBetDto = {
  priceGame: 2.5,
  numbeChoose: '03,12,20,35,40,50',
  gameId: 1,
  userId: 1
}

export const fakeBetEntity: IBetEntity = {
  ...fakeCreatedBetEntity,
  id: 1,
  gameId: 1,
  userId: 1,
  secureId: '7b1f3001-6a4b-4bdd-90e9-8a280fff017d',
  user: {
    id: 1,
    name: 'alan bruno',
    email: 'alanbruno@gmail.com',
    accessProfileId: 1,
    secureId: '7b1f3001-6a4b-4bdd-90e9-8a280fff017f',
    created_at: new Date(),
    updated_at: new Date()
  },
  game:
  {
    id: 1,
    type: 'mega-sena',
    color: 'red',
    maxNumber: 6,
    range: 60,
    price: 2.5,
    secureId: '7b1f3001-6a4b-4bdd-90e9-8a280fff0176',
    created_at: new Date(),
    updated_at: new Date()
  },
  created_at: new Date(),
  updated_at: new Date()
}
// Nao desejo que a senha dos usuarios retornem
export const fakeBetsList: IBetEntity[] = [
  {
    id: 1,
    priceGame: 2.5,
    numbeChoose: '03,12,20,35,40,50',
    gameId: 1,
    userId: 1,
    secureId: '123e4567-e89b-12d3-a456-426614174000',
    created_at: new Date('2021-09-21T10:00:00.000Z'),
    updated_at: new Date('2021-09-21T10:00:00.000Z')
  },
  {
    id: 1,
    priceGame: 2.5,
    numbeChoose: '03,12,20,35,40,55',
    gameId: 1,
    userId: 1,
    secureId: '123e4567-e89b-12d3-a456-426614174001',
    created_at: new Date('2021-09-21T10:00:00.000Z'),
    updated_at: new Date('2021-09-21T10:00:00.000Z')
  },
  {
    id: 1,
    priceGame: 2.5,
    numbeChoose: '03,12,20,35,44,50',
    gameId: 1,
    userId: 1,
    secureId: '123e4567-e89b-12d3-a456-426614174002',
    created_at: new Date('2021-09-21T10:00:00.000Z'),
    updated_at: new Date('2021-09-21T10:00:00.000Z')
  },
  {
    id: 1,
    priceGame: 2.5,
    numbeChoose: '33,12,20,35,40,50',
    gameId: 1,
    userId: 1,
    secureId: '123e4567-e89b-12d3-a456-426614174003',
    created_at: new Date('2021-09-21T10:00:00.000Z'),
    updated_at: new Date('2021-09-21T10:00:00.000Z')
  }
]
