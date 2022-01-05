import { IInputCreateBetDto } from '@business/dto/bet/create'
import { IBetEntity, InputBetEntity } from '@domain/entities/betEntity'

export const fakeCreatedBetEntity: InputBetEntity = {
  price_game: 2.5,
  number_choose: '03,12,20,35,40,50'
}

export const fakeNewBet: IInputCreateBetDto = {
  price_game: 2.5,
  number_choose: '03,12,20,35,40,50',
  game_id: 1,
  user_id: 1
}

export const fakeBetEntity: IBetEntity = {
  ...fakeCreatedBetEntity,
  id: 1,
  game_id: 1,
  user_id: 1,
  secure_id: '7b1f3001-6a4b-4bdd-90e9-8a280fff017d',
  user: {
    id: 1,
    name: 'alan bruno',
    email: 'alanbruno@gmail.com',
    access_profile_id: 1,
    secure_id: '7b1f3001-6a4b-4bdd-90e9-8a280fff017f',
    created_at: new Date(),
    updated_at: new Date()
  },
  game:
  {
    id: 1,
    type: 'mega-sena',
    color: 'red',
    max_number: 6,
    range: 60,
    price: 2.5,
    secure_id: '7b1f3001-6a4b-4bdd-90e9-8a280fff0176',
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
    price_game: 2.5,
    number_choose: '03,12,20,35,40,50',
    game_id: 1,
    user_id: 1,
    secure_id: '123e4567-e89b-12d3-a456-426614174000',
    created_at: new Date('2021-09-21T10:00:00.000Z'),
    updated_at: new Date('2021-09-21T10:00:00.000Z')
  },
  {
    id: 2,
    price_game: 2.5,
    number_choose: '03,12,20,35,40,55',
    game_id: 1,
    user_id: 1,
    secure_id: '123e4567-e89b-12d3-a456-426614174001',
    created_at: new Date('2021-09-21T10:00:00.000Z'),
    updated_at: new Date('2021-09-21T10:00:00.000Z')
  },
  {
    id: 3,
    price_game: 2.5,
    number_choose: '03,12,20,35,44,50',
    game_id: 1,
    user_id: 1,
    secure_id: '123e4567-e89b-12d3-a456-426614174002',
    created_at: new Date('2021-09-21T10:00:00.000Z'),
    updated_at: new Date('2021-09-21T10:00:00.000Z')
  },
  {
    id: 4,
    price_game: 2.5,
    number_choose: '33,12,20,35,40,50',
    game_id: 1,
    user_id: 1,
    secure_id: '123e4567-e89b-12d3-a456-426614174003',
    created_at: new Date('2021-09-21T10:00:00.000Z'),
    updated_at: new Date('2021-09-21T10:00:00.000Z')
  }
]
