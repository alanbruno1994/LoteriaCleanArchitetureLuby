import { IInputCreateGameDto } from '@business/dto/game/create'
import { IGameEntity, InputGameEntity } from '@domain/entities/gameEntity'

export const fakeCreatedGameEntity: InputGameEntity = {
  type: 'Mega Sena',
  range: 60,
  price: 2.5,
  maxNumber: 6,
  color: 'red'
}

export const fakeNewGame: IInputCreateGameDto = {
  type: 'Mega Sena',
  range: 60,
  price: 2.5,
  maxNumber: 6,
  color: 'red'
}

export const fakeGameEntity: IGameEntity = {
  ...fakeCreatedGameEntity,
  id: 1,
  secureId: '7b1f3001-6a4b-4bdd-90e9-8a280fff017d',
  users: [],
  created_at: new Date(),
  updated_at: new Date()
}
// Nao desejo que a senha dos usuarios retornem
export const fakeGameList: IGameEntity[] = [
  {
    id: 1,
    type: 'Mega Sena',
    range: 60,
    price: 2.5,
    maxNumber: 6,
    color: 'red',
    secureId: '123e4567-e89b-12d3-a456-426614174000',
    created_at: new Date('2021-09-21T10:00:00.000Z'),
    updated_at: new Date('2021-09-21T10:00:00.000Z')
  },
  {
    id: 2,
    type: 'Mega Sena',
    range: 60,
    price: 2.5,
    maxNumber: 6,
    color: 'red',
    secureId: '123e4567-e89b-12d3-a456-426614174001',
    created_at: new Date('2021-09-21T10:00:00.000Z'),
    updated_at: new Date('2021-09-21T10:00:00.000Z')
  },
  {
    id: 3,
    type: 'Mega Sena',
    range: 60,
    price: 2.5,
    maxNumber: 6,
    color: 'red',
    secureId: '123e4567-e89b-12d3-a456-426614174002',
    created_at: new Date('2021-09-21T10:00:00.000Z'),
    updated_at: new Date('2021-09-21T10:00:00.000Z')
  },
  {
    id: 4,
    type: 'Mega Sena',
    range: 60,
    price: 2.5,
    maxNumber: 6,
    color: 'red',
    secureId: '123e4567-e89b-12d3-a456-426614174003',
    created_at: new Date('2021-09-21T10:00:00.000Z'),
    updated_at: new Date('2021-09-21T10:00:00.000Z')
  }
]
